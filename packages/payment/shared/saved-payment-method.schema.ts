import { z } from 'zod';
import { paymentVendorSchema } from './payment-vendor.schema';

export const savedPaymentMethodSchema = z.object({
  vendorTokenReference: z.string().min(1),
  vendor: paymentVendorSchema.default('stripewave'),
  lastFour: z.string().length(4),
  cardType: z.string().min(1),
  expiryMonth: z.number().int().min(1).max(12),
  expiryYear: z.number().int(),
  label: z.string().optional(),
});

export const savedPaymentMethodDtoSchema = z.object({
  id: z.string().uuid(),
  vendor: paymentVendorSchema.default('stripewave'),
  lastFour: z.string().length(4),
  cardType: z.string(),
  expiryMonth: z.number().int(),
  expiryYear: z.number().int(),
  isDefault: z.boolean(),
  isExpired: z.boolean(),
  label: z.string().optional(),
});

export const payWithSavedMethodSchema = z.object({
  savedPaymentMethodId: z.string().uuid(),
});

export type SavedPaymentMethodInput = z.infer<typeof savedPaymentMethodSchema>;
export type SavedPaymentMethodDto = z.infer<typeof savedPaymentMethodDtoSchema>;
