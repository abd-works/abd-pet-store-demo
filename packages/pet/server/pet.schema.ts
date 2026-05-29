import { z } from 'zod';

export const petFilterSchema = z.object({
  species: z.enum(['dog', 'cat', 'reptile', 'small_mammal', 'bird', 'fish']).optional(),
});

export const petProfileUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  breed: z.string().min(1).optional(),
  age: z.number().int().min(0).optional(),
  temperamentNotes: z.string().max(1000).nullable().optional(),
  addPhotoUrl: z.string().url().optional(),
  removePhotoUrl: z.string().url().optional(),
});

export const adoptPetSchema = z.object({
  status: z.literal('adopted'),
});

export type PetFilter = z.infer<typeof petFilterSchema>;
export type PetProfileUpdate = z.infer<typeof petProfileUpdateSchema>;
