import { Router } from 'express';
import type { InventoryDashboardController } from './inventory-dashboard.controller';

export function createInventoryDashboardRouter(controller: InventoryDashboardController): Router {
  const router = Router();
  router.get('/admin/inventory', controller.list);
  return router;
}
