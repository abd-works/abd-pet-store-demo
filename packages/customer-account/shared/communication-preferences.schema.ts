import { z } from 'zod';
import { MARKETING_CATEGORIES } from './MarketingCategory';

export const toggleCommunicationPreferenceSchema = z.object({
  category: z.enum(MARKETING_CATEGORIES),
  optedIn: z.boolean(),
});

export type ToggleCommunicationPreferenceInput = z.infer<typeof toggleCommunicationPreferenceSchema>;

export const communicationPreferencesDtoSchema = z.object({
  accountId: z.string(),
  categories: z.array(z.object({
    category: z.enum(MARKETING_CATEGORIES),
    status: z.enum(['opted-in', 'opted-out']),
    optedInAt: z.string().optional(),
    optedOutAt: z.string().optional(),
  })),
  onMarketingEmailList: z.boolean(),
});

export type CommunicationPreferencesDto = z.infer<typeof communicationPreferencesDtoSchema>;
