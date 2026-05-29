import type { Collection } from 'mongodb';
import { Pet, type PetSnapshot } from '../shared/Pet';
import type { PetId } from '../shared/PetId';
import type { Species } from '../shared/Species';
import type { IPetRepository } from './pet.repository';

export class PetMongoRepository implements IPetRepository {
  constructor(private readonly collection: Collection<PetSnapshot>) {}

  async findAll(species?: Species): Promise<Pet[]> {
    const filter = species ? { species } : {};
    const docs = await this.collection.find(filter).toArray();
    return docs.map((doc) => Pet.fromSnapshot(doc));
  }

  async findById(petId: PetId): Promise<Pet | null> {
    const doc = await this.collection.findOne({ id: petId });
    if (!doc) return null;
    return Pet.fromSnapshot(doc);
  }

  async save(pet: Pet): Promise<void> {
    const snapshot = pet.toSnapshot();
    await this.collection.replaceOne({ id: snapshot.id }, snapshot, { upsert: true });
  }
}
