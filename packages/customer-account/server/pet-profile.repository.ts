import { randomUUID } from 'node:crypto';

export interface PetProfileRecord {
  id: string;
  accountId: string;
  name: string;
  species: string;
  breed?: string;
  ageOrDob?: string;
  photoUrl?: string;
}

export interface PetProfileRepository {
  listByAccount(accountId: string): Promise<PetProfileRecord[]>;
  findById(id: string): Promise<PetProfileRecord | undefined>;
  save(profile: PetProfileRecord): Promise<void>;
  delete(id: string): Promise<void>;
  reset(): void;
}

export class InMemoryPetProfileRepository implements PetProfileRepository {
  private readonly byId = new Map<string, PetProfileRecord>();

  async listByAccount(accountId: string): Promise<PetProfileRecord[]> {
    return [...this.byId.values()].filter((profile) => profile.accountId === accountId);
  }

  async findById(id: string): Promise<PetProfileRecord | undefined> {
    return this.byId.get(id);
  }

  async save(profile: PetProfileRecord): Promise<void> {
    this.byId.set(profile.id, profile);
  }

  async delete(id: string): Promise<void> {
    this.byId.delete(id);
  }

  reset(): void {
    this.byId.clear();
  }
}

export function createPetProfile(input: Omit<PetProfileRecord, 'id'>): PetProfileRecord {
  return { id: randomUUID(), ...input };
}
