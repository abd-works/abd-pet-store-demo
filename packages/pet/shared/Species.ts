export const SpeciesValues = {
  Dog: 'dog',
  Cat: 'cat',
  Reptile: 'reptile',
  SmallMammal: 'small_mammal',
  Bird: 'bird',
  Fish: 'fish',
} as const;

export type Species = (typeof SpeciesValues)[keyof typeof SpeciesValues];
