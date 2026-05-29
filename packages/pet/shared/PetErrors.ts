export class PetAlreadyAdoptedError extends Error {
  constructor(petId: string) {
    super(`Pet ${petId} is already adopted`);
    this.name = 'PetAlreadyAdoptedError';
  }
}

export class PetNotFoundError extends Error {
  constructor(petId: string) {
    super(`Pet not found: ${petId}`);
    this.name = 'PetNotFoundError';
  }
}
