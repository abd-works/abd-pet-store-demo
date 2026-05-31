import { Router } from 'express';
import type { UnsubscribeController } from './unsubscribe.controller';

export function createUnsubscribeRouter(controller: UnsubscribeController): Router {
  const router = Router();
  router.get('/marketing/unsubscribe/:token', controller.unsubscribe);
  return router;
}
