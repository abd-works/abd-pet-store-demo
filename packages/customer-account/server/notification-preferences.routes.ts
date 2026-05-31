import { Router } from 'express';
import type { NotificationPreferencesController } from './notification-preferences.controller';

export function createNotificationPreferencesRouter(
  controller: NotificationPreferencesController,
): Router {
  const router = Router();
  router.get('/account/notification-preferences', controller.getPreferences);
  router.patch('/account/notification-preferences', controller.toggleCategory);
  return router;
}
