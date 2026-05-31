import { Router } from 'express';
import type { CommunicationPreferencesController } from './communication-preferences.controller';

export function createCommunicationPreferencesRouter(
  controller: CommunicationPreferencesController,
): Router {
  const router = Router();
  router.get('/account/communication-preferences', controller.getPreferences);
  router.patch('/account/communication-preferences', controller.toggleCategory);
  return router;
}
