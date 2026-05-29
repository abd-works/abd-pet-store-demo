import { z } from 'zod';

export const savedAddressInputSchema = z.object({
  recipientName: z.string().min(1, 'Recipient name is required'),
  addressLine1: z.string().min(1, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  countyOrRegion: z.string().optional(),
  postcode: z.string().min(1, 'Postcode is required'),
  country: z.string().min(1, 'Country is required'),
  label: z.string().optional(),
});

export const savedAddressDtoSchema = savedAddressInputSchema.extend({
  id: z.string(),
  isDefault: z.boolean(),
});

export type SavedAddressInput = z.infer<typeof savedAddressInputSchema>;
export type SavedAddressDto = z.infer<typeof savedAddressDtoSchema>;
