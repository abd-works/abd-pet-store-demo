import { Router } from 'express';

import type { OrderController } from './order.controller';



export function createOrderRouter(controller: OrderController): Router {

  const router = Router();

  router.post('/api/orders', controller.createFromCart);

  router.get('/api/orders/queue', controller.listQueue);

  router.post('/api/orders/status/lookup', controller.lookupOrderStatus);

  router.get('/api/orders/status/:orderNumber', controller.getOrderStatus);

  router.get('/api/orders/:orderNumber', controller.getOrder);

  router.patch('/api/orders/:orderNumber/prepared', controller.markPrepared);

  router.patch('/api/orders/:orderNumber/collected', controller.markCollected);

  router.patch('/api/orders/:orderNumber/fulfilled', controller.markFulfilled);

  router.patch('/api/orders/:orderNumber/tracking', controller.addTrackingNumber);

  return router;

}


