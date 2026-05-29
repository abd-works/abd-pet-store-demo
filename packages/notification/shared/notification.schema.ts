import { z } from 'zod';

export const notificationTypeValues = [
  'appointment_confirmation',
  'appointment_reminder',
  'visit_follow_up',
  'pet_adopted',
  'return_received',
  'refund_completed',
  'refund_under_review',
] as const;

export type NotificationType = (typeof notificationTypeValues)[number];

export const notificationPayloadSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  type: z.enum(notificationTypeValues),
  referenceId: z.string(),
  html: z.string().optional(),
});

export type NotificationPayload = z.infer<typeof notificationPayloadSchema>;

export const returnReceivedPayloadSchema = notificationPayloadSchema.extend({
  type: z.literal('return_received'),
  orderNumber: z.string(),
  returnedItems: z.array(z.object({
    name: z.string(),
    quantity: z.number().int().min(1),
  })),
});

export type ReturnReceivedPayload = z.infer<typeof returnReceivedPayloadSchema>;

export const refundCompletedPayloadSchema = notificationPayloadSchema.extend({
  type: z.literal('refund_completed'),
  refundedAmount: z.number(),
  formattedAmount: z.string(),
  paymentMethod: z.string(),
});

export type RefundCompletedPayload = z.infer<typeof refundCompletedPayloadSchema>;

export const refundUnderReviewPayloadSchema = notificationPayloadSchema.extend({
  type: z.literal('refund_under_review'),
  orderNumber: z.string(),
  returnReference: z.string(),
});

export type RefundUnderReviewPayload = z.infer<typeof refundUnderReviewPayloadSchema>;

export const notificationQueueEntrySchema = z.object({
  referenceId: z.string(),
  type: z.enum(notificationTypeValues),
  attempts: z.number().int().min(0),
  nextAttemptAt: z.string().optional(),
  status: z.enum(['pending', 'sent', 'failed']),
});

export type NotificationQueueEntry = z.infer<typeof notificationQueueEntrySchema>;
