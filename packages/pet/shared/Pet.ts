import { type PetId, toPetId } from './PetId';
import { PetPhotoGallery } from './PetPhotoGallery';
import { PetAlreadyAdoptedError } from './PetErrors';
import { PetStatusValues, type PetStatus } from './PetStatus';
import type { Species } from './Species';
import type { TemperamentNotes } from './TemperamentNotes';

export interface PetSnapshot {
  id: string;
  name: string;
  species: Species;
  breed: string;
  age: number;
  temperamentNotes: string | null;
  photoUrls: string[];
  status: PetStatus;
  storeCode: string;
}

export interface PetCardDto {
  id: string;
  name: string;
  breed: string;
  species: Species;
  storeName: string;
  thumbnailUrl: string | null;
  status: PetStatus;
}

export interface PetProfileDto extends PetCardDto {
  age: number;
  temperamentNotes: string | null;
  photoUrls: string[];
  distanceKm: number | null;
}

/** << Entity >> — store animal available for adoption (Increment 6). */
export class Pet {
  readonly id: PetId;
  readonly name: string;
  readonly species: Species;
  readonly breed: string;
  readonly age: number;
  readonly temperamentNotes: TemperamentNotes | null;
  private photoGallery: PetPhotoGallery;
  status: PetStatus;
  readonly storeCode: string;

  constructor(params: {
    id: PetId;
    name: string;
    species: Species;
    breed: string;
    age: number;
    temperamentNotes: TemperamentNotes | null;
    photoUrls: string[];
    status: PetStatus;
    storeCode: string;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.species = params.species;
    this.breed = params.breed;
    this.age = params.age;
    this.temperamentNotes = params.temperamentNotes;
    this.photoGallery = PetPhotoGallery.fromJSON(params.photoUrls);
    this.status = params.status;
    this.storeCode = params.storeCode;
  }

  get photoUrls(): readonly string[] {
    return this.photoGallery.urls;
  }

  markAdopted(): void {
    if (this.status === PetStatusValues.Adopted) {
      throw new PetAlreadyAdoptedError(this.id);
    }
    this.status = PetStatusValues.Adopted;
  }

  addPhoto(url: string): void {
    this.photoGallery = this.photoGallery.addPhoto(url);
  }

  removePhoto(url: string): void {
    this.photoGallery = this.photoGallery.removePhoto(url);
  }

  toSnapshot(): PetSnapshot {
    return {
      id: this.id,
      name: this.name,
      species: this.species,
      breed: this.breed,
      age: this.age,
      temperamentNotes: this.temperamentNotes,
      photoUrls: [...this.photoGallery.urls],
      status: this.status,
      storeCode: this.storeCode,
    };
  }

  static fromSnapshot(snapshot: PetSnapshot): Pet {
    return new Pet({
      id: toPetId(snapshot.id),
      name: snapshot.name,
      species: snapshot.species as Species,
      breed: snapshot.breed,
      age: snapshot.age,
      temperamentNotes: snapshot.temperamentNotes as TemperamentNotes | null,
      photoUrls: snapshot.photoUrls,
      status: snapshot.status,
      storeCode: snapshot.storeCode,
    });
  }
}
