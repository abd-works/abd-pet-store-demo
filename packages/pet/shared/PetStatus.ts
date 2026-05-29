export const PetStatusValues = {
  Available: 'available',
  Adopted: 'adopted',
} as const;

export type PetStatus = (typeof PetStatusValues)[keyof typeof PetStatusValues];
