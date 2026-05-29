import { z } from 'zod';

export const returnStatusValues = [
  'initiated',
  'label_generated',
  'shipped_back',
  'received',
  'inspected',
  'refund_processing',
  'completed',
] as const;

export type ReturnStatus = (typeof returnStatusValues)[number];

export const refundStatusValues = ['processing', 'completed', 'requires_review'] as const;
export type RefundStatus = (typeof refundStatusValues)[number];

export const returnReasonValues = [
  'wrong_size',
  'changed_mind',
  'defective',
  'not_as_described',
  'other',
] as const;
export type ReturnReason = (typeof returnReasonValues)[number];

export const itemConditionValues = ['unopened', 'opened', 'damaged'] as const;
export type ItemCondition = (typeof itemConditionValues)[number];

export const returnedItemSchema = z.object({
  sku: z.string(),
  name: z.string(),
  quantity: z.number().int().min(1),
  eligible: z.boolean(),
  alreadyReturning: z.boolean().optional(),
});
export type ReturnedItemDto = z.infer<typeof returnedItemSchema>;

export const returnRequestSchema = z.object({
  orderNumber: z.string(),
  items: z.array(z.object({
    sku: z.string(),
    quantity: z.number().int().min(1),
  })).min(1),
  returnReason: z.enum(returnReasonValues),
  itemCondition: z.enum(itemConditionValues),
  damageDescription: z.string().optional(),
});
export type ReturnRequestInput = z.infer<typeof returnRequestSchema>;

export const returnDtoSchema = z.object({
  returnId: z.string(),
  orderNumber: z.string(),
  returnStatus: z.enum(returnStatusValues),
  returnedItems: z.array(returnedItemSchema),
  returnReason: z.enum(returnReasonValues),
  itemCondition: z.enum(itemConditionValues),
  damageDescription: z.string().optional(),
  returnReference: z.string(),
  labelUrl: z.string().nullable(),
  qrCodeData: z.string().nullable(),
  labelUnavailable: z.boolean().optional(),
  createdAt: z.string(),
});
export type ReturnDto = z.infer<typeof returnDtoSchema>;

export const returnEligibilitySchema = z.object({
  eligible: z.boolean(),
  reason: z.string().optional(),
  eligibleItems: z.array(returnedItemSchema),
});
export type ReturnEligibilityDto = z.infer<typeof returnEligibilitySchema>;

export const refundDtoSchema = z.object({
  refundId: z.string(),
  orderNumber: z.string(),
  returnId: z.string(),
  vendor: z.string(),
  amount: z.number(),
  amountFormatted: z.string(),
  refundStatus: z.enum(refundStatusValues),
  maskedPaymentMethod: z.string().optional(),
  createdAt: z.string(),
  completedAt: z.string().nullable(),
});
export type RefundDto = z.infer<typeof refundDtoSchema>;

export const staffReturnRequestSchema = z.object({
  orderNumber: z.string(),
  items: z.array(z.object({
    sku: z.string(),
    quantity: z.number().int().min(1),
  })).min(1),
  returnReason: z.enum(returnReasonValues),
  itemCondition: z.enum(itemConditionValues),
  managerOverride: z.boolean().optional(),
  overrideReason: z.string().optional(),
  approvingManager: z.string().optional(),
});
export type StaffReturnRequestInput = z.infer<typeof staffReturnRequestSchema>;
