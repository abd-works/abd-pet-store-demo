import { z } from 'zod';

export const paymentVendorSchema = z.enum(['stripewave', 'paynova', 'vaultpay']);
export type PaymentVendor = z.infer<typeof paymentVendorSchema>;

export const payOrderRequestSchema = z.object({
  vendor: paymentVendorSchema.optional(),
  cardNumber: z.string().optional(),
  expiry: z.string().optional(),
  cvv: z.string().optional(),
  savedPaymentMethodId: z.string().optional(),
  acceptInstalmentPlan: z.boolean().optional(),
});

export type PayOrderRequest = z.infer<typeof payOrderRequestSchema>;

/** @deprecated use PaymentRetryStatusDto from payment-retry.schema */
export type { PaymentRetryStatusDto as PaymentRetryStatus } from './payment-retry.schema';
