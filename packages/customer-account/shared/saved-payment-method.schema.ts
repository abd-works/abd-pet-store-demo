import { z } from 'zod';

export const savedPaymentVendorSchema = z.enum(['stripewave', 'paynova', 'vaultpay']);
export type SavedPaymentVendor = z.infer<typeof savedPaymentVendorSchema>;

export const savedPaymentMethodDtoSchema = z.object({
  id: z.string(),
  lastFour: z.string().length(4),
  cardType: z.string(),
  expiryMonth: z.number().int(),
  expiryYear: z.number().int(),
  isDefault: z.boolean(),
  isExpired: z.boolean(),
  vendor: savedPaymentVendorSchema.default('stripewave'),
});

export const saveVendorPaymentMethodSchema = z.object({
  vendor: savedPaymentVendorSchema,
  vendorToken: z.string().min(1),
});

export type SavedPaymentMethodDto = z.infer<typeof savedPaymentMethodDtoSchema>;
export type SaveVendorPaymentMethodInput = z.infer<typeof saveVendorPaymentMethodSchema>;
