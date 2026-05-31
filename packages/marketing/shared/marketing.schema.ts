import { z } from 'zod';

export const promotionalBatchSchema = z.object({
  subject: z.string().min(1),
  bodyHtml: z.string().min(1),
  recipientAccountIds: z.array(z.string()).min(1),
});

export type PromotionalBatchInput = z.infer<typeof promotionalBatchSchema>;

export const restockAlertTriggerSchema = z.object({
  sku: z.string().min(1),
  productName: z.string().min(1),
});

export type RestockAlertTriggerInput = z.infer<typeof restockAlertTriggerSchema>;

export const inStoreEventSchema = z.object({
  eventTitle: z.string().min(1),
  storeName: z.string().min(1),
  storeCode: z.string().min(1),
});

export type InStoreEventInput = z.infer<typeof inStoreEventSchema>;

export const personalizedRecommendationSchema = z.object({
  accountId: z.string().min(1),
});

export type PersonalizedRecommendationInput = z.infer<typeof personalizedRecommendationSchema>;
