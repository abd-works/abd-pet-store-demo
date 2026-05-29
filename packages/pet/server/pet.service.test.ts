import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PetService } from './pet.service';
import { Pet } from '../shared/Pet';
import { PetStatusValues } from '../shared/PetStatus';
import { PetAlreadyAdoptedError, PetNotFoundError } from '../shared/PetErrors';
import { toPetId } from '../shared/PetId';
import type { IPetRepository } from './pet.repository';

function buildAvailablePet(id: string): Pet {
  return new Pet({
    id: toPetId(id),
    name: 'Buddy',
    species: 'dog',
    breed: 'Labrador',
    age: 2,
    temperamentNotes: null,
    photoUrls: ['https://example.com/buddy.jpg'],
    status: PetStatusValues.Available,
    storeCode: 'STR-001',
  });
}

function buildAdoptedPet(id: string): Pet {
  const pet = buildAvailablePet(id);
  pet.status = PetStatusValues.Adopted;
  return pet;
}

class MarkPetAsAdoptedBehaviours {
  private petRepository: IPetRepository;
  private notificationService: { notifyPendingAppointmentsOfAdoption: ReturnType<typeof vi.fn> };
  private service: PetService;

  constructor() {
    this.petRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      save: vi.fn(),
    };
    this.notificationService = {
      notifyPendingAppointmentsOfAdoption: vi.fn().mockResolvedValue(undefined),
    };
    const storeLocatorService = { distanceFromCustomer: vi.fn() };
    this.service = new PetService(
      this.petRepository,
      storeLocatorService,
      this.notificationService,
      () => 'Pawplace City Store',
    );
  }

  async givenAvailablePet(id: string): Promise<void> {
    vi.mocked(this.petRepository.findById).mockResolvedValue(buildAvailablePet(id));
    vi.mocked(this.petRepository.save).mockResolvedValue(undefined);
  }

  async givenAdoptedPet(id: string): Promise<void> {
    vi.mocked(this.petRepository.findById).mockResolvedValue(buildAdoptedPet(id));
  }

  async whenStaffMarksAsAdopted(id: string): Promise<void> {
    await this.service.markAdopted(toPetId(id));
  }

  async thenPetStatusIsAdopted(id: string): Promise<void> {
    const saved = vi.mocked(this.petRepository.save).mock.calls[0][0] as Pet;
    expect(saved.status).toBe(PetStatusValues.Adopted);
  }

  async thenMarkingAdoptedThrows(id: string, ErrorClass: typeof Error): Promise<void> {
    await expect(this.service.markAdopted(toPetId(id))).rejects.toBeInstanceOf(ErrorClass);
  }
}

class ListBySpeciesBehaviours {
  private petRepository: IPetRepository;
  private service: PetService;

  constructor() {
    this.petRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      save: vi.fn(),
    };
    this.service = new PetService(
      this.petRepository,
      { distanceFromCustomer: vi.fn() },
      { notifyPendingAppointmentsOfAdoption: vi.fn() },
      (code) => `Store ${code}`,
    );
  }

  async givenPetsOfAllStatuses(): Promise<void> {
    vi.mocked(this.petRepository.findAll).mockResolvedValue([
      buildAvailablePet('PET-001'),
      buildAdoptedPet('PET-002'),
    ]);
  }

  async whenListBySpecies(): Promise<ReturnType<PetService['listBySpecies']>> {
    return this.service.listBySpecies('dog');
  }

  thenBothStatusesReturned(result: Awaited<ReturnType<PetService['listBySpecies']>>): void {
    expect(result).toHaveLength(2);
    expect(result.map((p) => p.status)).toContain(PetStatusValues.Available);
    expect(result.map((p) => p.status)).toContain(PetStatusValues.Adopted);
  }
}

describe('PetService — Mark Pet As Adopted', () => {
  const helper = new MarkPetAsAdoptedBehaviours();

  it('adopted pet status transitions to adopted', async () => {
    await helper.givenAvailablePet('PET-001');
    await helper.whenStaffMarksAsAdopted('PET-001');
    await helper.thenPetStatusIsAdopted('PET-001');
  });

  it('already adopted pet throws domain error', async () => {
    await helper.givenAdoptedPet('PET-002');
    await helper.thenMarkingAdoptedThrows('PET-002', PetAlreadyAdoptedError);
  });
});

describe('PetService — List By Species', () => {
  const helper = new ListBySpeciesBehaviours();

  it('returns pets of all lifecycle statuses so adopted pets render with badge', async () => {
    await helper.givenPetsOfAllStatuses();
    const result = await helper.whenListBySpecies();
    helper.thenBothStatusesReturned(result);
  });
});
