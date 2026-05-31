import { createPetProfile, type PetProfileRecord, type PetProfileRepository } from './pet-profile.repository';

export class PetProfileNotFoundError extends Error {
  constructor(id: string) {
    super(`Pet profile not found: ${id}`);
    this.name = 'PetProfileNotFoundError';
  }
}

export class PetProfileService {
  constructor(private readonly repository: PetProfileRepository) {}

  async list(accountId: string): Promise<PetProfileRecord[]> {
    return this.repository.listByAccount(accountId);
  }

  async create(
    accountId: string,
    input: { name: string; species: string; breed?: string; ageOrDob?: string; photoUrl?: string },
  ): Promise<PetProfileRecord> {
    const profile = createPetProfile({ accountId, ...input });
    await this.repository.save(profile);
    return profile;
  }

  async update(
    accountId: string,
    id: string,
    input: Partial<Pick<PetProfileRecord, 'name' | 'species' | 'breed' | 'ageOrDob' | 'photoUrl'>>,
  ): Promise<PetProfileRecord> {
    const existing = await this.requireOwned(accountId, id);
    const updated = { ...existing, ...input };
    await this.repository.save(updated);
    return updated;
  }

  async delete(accountId: string, id: string): Promise<void> {
    await this.requireOwned(accountId, id);
    await this.repository.delete(id);
  }

  private async requireOwned(accountId: string, id: string): Promise<PetProfileRecord> {
    const profile = await this.repository.findById(id);
    if (!profile || profile.accountId !== accountId) throw new PetProfileNotFoundError(id);
    return profile;
  }
}
