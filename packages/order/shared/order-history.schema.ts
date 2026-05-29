import { z } from 'zod';

export const orderHistorySummarySchema = z.object({
  orderNumber: z.string(),
  placedAt: z.string().datetime(),
  itemCount: z.number().int().positive(),
  totalPence: z.number().int(),
  statusLabel: z.string(),
});

export const reorderLineSchema = z.object({
  sku: z.string(),
  quantity: z.number().int().positive(),
  productName: z.string().optional(),
});

export const reorderResultSchema = z.object({
  added: z.array(reorderLineSchema),
  skipped: z.array(
    z.object({
      sku: z.string(),
      reason: z.string(),
    }),
  ),
  partialMessage: z.string().optional(),
});

export const authenticatedCheckoutSchema = z.object({
  savedAddressId: z.string().uuid().optional(),
  saveAddress: z.boolean().optional(),
  billingAddress: z
    .object({
      name: z.string().min(1),
      addressLine1: z.string().min(1),
      addressLine2: z.string().optional(),
      city: z.string().min(1),
      countyOrRegion: z.string().optional(),
      postcode: z.string().min(1),
      country: z.string().min(1),
    })
    .optional(),
  savedPaymentMethodId: z.string().uuid().optional(),
  savePaymentMethod: z.boolean().optional(),
});

export type OrderHistorySummaryDto = z.infer<typeof orderHistorySummarySchema>;
export type ReorderResultDto = z.infer<typeof reorderResultSchema>;
export type AuthenticatedCheckoutInput = z.infer<typeof authenticatedCheckoutSchema>;
