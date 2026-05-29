import type { Pet } from '../shared/Pet';
import type { PetId } from '../shared/PetId';
import type { Species } from '../shared/Species';

export interface IPetRepository {
  findAll(species?: Species): Promise<Pet[]>;
  findById(petId: PetId): Promise<Pet | null>;
  save(pet: Pet): Promise<void>;
}
