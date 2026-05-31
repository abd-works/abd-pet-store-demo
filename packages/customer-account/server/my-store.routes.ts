import { Router } from 'express';
import type { MyStoreController } from './my-store.controller';

export function createMyStoreRouter(controller: MyStoreController): Router {
  const router = Router();
  router.get('/account/my-store', controller.getMyStore);
  router.put('/account/my-store', controller.setMyStore);
  router.delete('/account/my-store', controller.clearMyStore);
  return router;
}
