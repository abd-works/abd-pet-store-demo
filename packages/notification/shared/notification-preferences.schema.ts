import { z } from 'zod';
import { TRANSACTIONAL_CATEGORIES } from './TransactionalCategory';

export const toggleNotificationPreferenceSchema = z.object({
  category: z.enum(TRANSACTIONAL_CATEGORIES),
  enabled: z.boolean(),
});

export type ToggleNotificationPreferenceInput = z.infer<typeof toggleNotificationPreferenceSchema>;

export const notificationPreferencesDtoSchema = z.object({
  accountId: z.string(),
  categories: z.array(z.object({
    category: z.enum(TRANSACTIONAL_CATEGORIES),
    enabled: z.boolean(),
  })),
  criticalNote: z.string(),
});

export type NotificationPreferencesDto = z.infer<typeof notificationPreferencesDtoSchema>;
