import { Router } from 'express';
import type { StoreController } from './store.controller';

export function createStoreRoutes(controller: StoreController): Router {
  const router = Router();

  router.get('/stores', controller.getStores);
  router.get('/stores/list', controller.getStoreList);
  router.get('/stores/:storeCode', controller.getStoreByCode);
  router.get('/stores/:storeCode/distance', controller.getDistance);

  return router;
}

export function createTestRoutes(controller: StoreController): Router {
  const router = Router();

  router.post('/test/stores', controller.seedStore);
  router.delete('/test/stores', controller.deleteStores);

  return router;
}
