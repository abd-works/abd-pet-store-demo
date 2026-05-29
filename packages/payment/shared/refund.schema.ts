import { z } from 'zod';

export const refundStatusLabelSchema = z.enum(['processing', 'completed', 'requires_review']);

export const refundDtoSchema = z.object({
  refundId: z.string(),
  orderNumber: z.string(),
  returnId: z.string(),
  vendor: z.enum(['stripewave', 'paynova', 'vaultpay']),
  amount: z.number(),
  refundStatus: refundStatusLabelSchema,
  timingExpectationNote: z.string().optional(),
  supportGuidance: z.string().optional(),
  createdAt: z.string(),
});

export const refundStatusDtoSchema = z.object({
  refundId: z.string(),
  orderNumber: z.string(),
  refundStatus: refundStatusLabelSchema,
  amount: z.number(),
  formattedAmount: z.string(),
  timingExpectationNote: z.string().optional(),
  supportGuidance: z.string().optional(),
});

export type RefundDto = z.infer<typeof refundDtoSchema>;
export type RefundStatusDto = z.infer<typeof refundStatusDtoSchema>;
