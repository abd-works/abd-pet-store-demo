import { z } from 'zod';

export const storeSchema = z.object({
  storeName: z.string().min(1),
  storeCode: z.string().min(1),
  addressLineOne: z.string().default(''),
  addressLineTwo: z.string().default(''),
  city: z.string().default(''),
  countyOrRegion: z.string().default(''),
  postcode: z.string().default(''),
  country: z.string().default(''),
  latitude: z.number().min(-90).max(90).default(0),
  longitude: z.number().min(-180).max(180).default(0),
  phoneNumber: z.string().default(''),
  emailAddress: z.string().default(''),
  activeStatus: z.boolean().default(true),
});

export type StoreData = z.infer<typeof storeSchema>;
