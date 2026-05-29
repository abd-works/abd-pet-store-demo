import { z } from 'zod';

export const wishlistItemDtoSchema = z.object({
  sku: z.string(),
  productName: z.string(),
  price: z.string(),
  stockAvailability: z.string(),
  imageUrl: z.string().optional(),
});

export const wishlistDtoSchema = z.object({
  items: z.array(wishlistItemDtoSchema),
});

export type WishlistItemDto = z.infer<typeof wishlistItemDtoSchema>;
export type WishlistDto = z.infer<typeof wishlistDtoSchema>;
