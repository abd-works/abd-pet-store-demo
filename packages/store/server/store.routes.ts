import { Router } from 'express';
import type { RetailStoreApi } from './retail-store-api';

export function createStoreRoutes(api: RetailStoreApi): Router {
  const router = Router();

  router.get('/stores', api.getStores);
  router.get('/stores/list', api.getStoreList);
  router.get('/stores/:storeCode', api.getStoreByCode);
  router.get('/stores/:storeCode/distance', api.getDistance);

  return router;
}

export function createTestRoutes(api: RetailStoreApi): Router {
  const router = Router();

  router.post('/test/stores', api.seedStore);
  router.delete('/test/stores', api.deleteStores);

  return router;
}
