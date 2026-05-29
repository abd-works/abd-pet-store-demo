import { z } from 'zod';

export const addCartItemSchema = z.object({
  sku: z.string().min(1),
  quantity: z.number().int().positive().optional().default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int(),
});

export const cartItemDtoSchema = z.object({
  sku: z.string(),
  name: z.string(),
  price: z.string(),
  quantity: z.number().int(),
  lineTotal: z.number(),
});

export const cartDtoSchema = z.object({
  items: z.array(cartItemDtoSchema),
  itemCount: z.number().int(),
  subtotal: z.number(),
  subtotalFormatted: z.string(),
});

export type CartDto = z.infer<typeof cartDtoSchema>;
export type CartItemDto = z.infer<typeof cartItemDtoSchema>;
