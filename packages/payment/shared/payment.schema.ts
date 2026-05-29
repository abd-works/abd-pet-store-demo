import { z } from 'zod';

export const paymentCardSchema = z.object({
  cardNumber: z.string().min(13).max(19),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/),
  cvv: z.string().min(3).max(4),
});

export const paymentRequestSchema = z.object({
  cardNumber: z.string(),
  expiry: z.string(),
  cvv: z.string(),
});

export const paymentStatusSchema = z.enum([
  'pending',
  'authorized',
  'captured',
  'settled',
  'failed',
]);

export type PaymentCardInput = z.infer<typeof paymentCardSchema>;
export type PaymentStatusDto = z.infer<typeof paymentStatusSchema>;

export interface PaymentResult {
  success: boolean;
  maskedPaymentMethod?: string;
  declineReason?: string;
  unavailable?: boolean;
  retryAfterMs?: number;
}

export const paymentDtoSchema = z.object({
  paymentReference: z.string(),
  associatedOrderNumber: z.string(),
  paymentAmount: z.number(),
  currency: z.string(),
  paymentStatus: paymentStatusSchema,
  maskedPaymentMethod: z.string().nullable().optional(),
  processingVendorCode: z.string(),
});

export type PaymentDto = z.infer<typeof paymentDtoSchema>;
