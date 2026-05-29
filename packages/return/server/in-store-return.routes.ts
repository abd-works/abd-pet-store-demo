import { Router } from 'express';
import type { InStoreReturnController } from './in-store-return.controller';

export function inStoreReturnRoutes(controller: InStoreReturnController): Router {
  const router = Router();

  router.post(
    '/api/staff/returns/lookup',
    (req, res) => controller.lookupOrder(req, res),
  );

  router.post(
    '/api/staff/returns',
    (req, res) => controller.initiateInStoreReturn(req, res),
  );

  return router;
}
