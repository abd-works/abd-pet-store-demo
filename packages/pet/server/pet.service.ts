import type { Pet, PetCardDto, PetProfileDto } from '../shared/Pet';
import { PetNotFoundError } from '../shared/PetErrors';
import type { PetId } from '../shared/PetId';
import type { Species } from '../shared/Species';
import type { IPetRepository } from './pet.repository';
import type { PetProfileUpdate } from './pet.schema';
import { toTemperamentNotes } from '../shared/TemperamentNotes';

export interface CustomerLocation {
  latitude: number;
  longitude: number;
}

export interface StoreLocatorService {
  distanceFromCustomer(storeCode: string, location: CustomerLocation): Promise<number>;
}

export interface AppointmentNotificationService {
  notifyPendingAppointmentsOfAdoption(petId: PetId): Promise<void>;
}

function toPetCardDto(pet: Pet, storeName: string): PetCardDto {
  return {
    id: pet.id,
    name: pet.name,
    breed: pet.breed,
    species: pet.species,
    storeName,
    thumbnailUrl: pet.photoUrls[0] ?? null,
    status: pet.status,
  };
}

function toPetProfileDto(pet: Pet, storeName: string, distanceKm: number | null): PetProfileDto {
  return {
    id: pet.id,
    name: pet.name,
    breed: pet.breed,
    species: pet.species,
    storeName,
    thumbnailUrl: pet.photoUrls[0] ?? null,
    status: pet.status,
    age: pet.age,
    temperamentNotes: pet.temperamentNotes,
    photoUrls: [...pet.photoUrls],
    distanceKm,
  };
}

export class PetService {
  constructor(
    private readonly petRepository: IPetRepository,
    private readonly storeLocatorService: StoreLocatorService,
    private readonly notificationService: AppointmentNotificationService,
    private readonly resolveStoreName: (storeCode: string) => string,
  ) {}

  async listBySpecies(species?: Species): Promise<PetCardDto[]> {
    const pets = await this.petRepository.findAll(species);
    // Returns pets of all statuses; client renders adopted pets with an 'Adopted' badge and no booking CTA
    return pets.map((pet) => toPetCardDto(pet, this.resolveStoreName(pet.storeCode)));
  }

  async getProfile(petId: PetId, customerLocation?: CustomerLocation): Promise<PetProfileDto> {
    const pet = await this.petRepository.findById(petId);
    if (!pet) throw new PetNotFoundError(petId);
    const distanceKm = customerLocation
      ? await this.storeLocatorService.distanceFromCustomer(pet.storeCode, customerLocation)
      : null;
    return toPetProfileDto(pet, this.resolveStoreName(pet.storeCode), distanceKm);
  }

  async updateProfile(petId: PetId, update: PetProfileUpdate): Promise<PetProfileDto> {
    const pet = await this.petRepository.findById(petId);
    if (!pet) throw new PetNotFoundError(petId);

    if (update.temperamentNotes !== undefined) {
      Object.assign(pet, {
        temperamentNotes: update.temperamentNotes !== null
          ? toTemperamentNotes(update.temperamentNotes)
          : null,
      });
    }
    if (update.addPhotoUrl) pet.addPhoto(update.addPhotoUrl);
    if (update.removePhotoUrl) pet.removePhoto(update.removePhotoUrl);

    await this.petRepository.save(pet);
    return toPetProfileDto(pet, this.resolveStoreName(pet.storeCode), null);
  }

  async markAdopted(petId: PetId): Promise<void> {
    const pet = await this.petRepository.findById(petId);
    if (!pet) throw new PetNotFoundError(petId);
    pet.markAdopted();
    await this.petRepository.save(pet);
    await this.notificationService.notifyPendingAppointmentsOfAdoption(petId);
  }
}
