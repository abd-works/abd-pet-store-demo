import { Router } from 'express';
import type { ReturnController } from './return.controller';

export function returnRoutes(controller: ReturnController): Router {
  const router = Router();

  router.get(
    '/api/account/orders/:orderNumber/return-eligibility',
    (req, res) => controller.checkEligibility(req, res),
  );

  router.post(
    '/api/account/orders/:orderNumber/returns',
    (req, res) => controller.initiateReturn(req, res),
  );

  router.get(
    '/api/account/orders/:orderNumber/returns',
    (req, res) => controller.getReturnsByOrder(req, res),
  );

  router.get(
    '/api/returns/:returnId',
    (req, res) => controller.getReturn(req, res),
  );

  router.get(
    '/api/account/orders/:orderNumber/refund-status',
    (req, res) => controller.getRefundStatus(req, res),
  );

  router.post(
    '/api/account/returns/statuses',
    (req, res) => controller.getBatchReturnStatuses(req, res),
  );

  return router;
}
