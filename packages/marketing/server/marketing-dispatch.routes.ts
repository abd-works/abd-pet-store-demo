import { Router } from 'express';
import type { MarketingDispatchController } from './marketing-dispatch.controller';

export function createMarketingDispatchRouter(controller: MarketingDispatchController): Router {
  const router = Router();
  router.post('/admin/marketing/promotional', controller.sendPromotionalBatch);
  router.post('/admin/marketing/recommendation', controller.sendPersonalizedRecommendation);
  router.post('/admin/marketing/restock-alert', controller.sendRestockAlert);
  router.post('/admin/marketing/in-store-event', controller.sendInStoreEvent);
  return router;
}
