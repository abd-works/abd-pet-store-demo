import { z } from 'zod';
import { paymentVendorSchema } from './payment-vendor.schema';

export const paymentRetryStatusSchema = z.enum(['idle', 'retrying', 'exhausted', 'succeeded']);

export const paymentRetryStatusDtoSchema = z.object({
  orderNumber: z.string(),
  retrying: z.boolean(),
  attemptCount: z.number().int().nonnegative(),
  maxAttempts: z.number().int().positive(),
  exhausted: z.boolean(),
  hardDecline: z.boolean(),
  declineReason: z.string().optional(),
  vendor: paymentVendorSchema,
});

export type PaymentRetryStatusLabel = z.infer<typeof paymentRetryStatusSchema>;
export type PaymentRetryStatusDto = z.infer<typeof paymentRetryStatusDtoSchema>;

export const retryWindowSchema = z.object({
  maximumAttemptCount: z.number().int().positive(),
  timeLimitMs: z.number().int().positive(),
});

export type RetryWindowConfig = z.infer<typeof retryWindowSchema>;

export const vendorTransactionReferenceSchema = z.object({
  vendorAssignedIdentifier: z.string().min(1),
  originatingPaymentVendor: paymentVendorSchema,
});

export type VendorTransactionReferenceDto = z.infer<typeof vendorTransactionReferenceSchema>;

export const instalmentPlanSchema = z.object({
  installmentCount: z.number().int().positive(),
  installmentAmount: z.number().positive(),
  instalmentReference: z.string().min(1),
});

export type InstalmentPlanDto = z.infer<typeof instalmentPlanSchema>;
