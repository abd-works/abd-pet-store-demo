import { Router } from 'express';
import type { CartController } from './cart.controller';

export function createCartRouter(controller: CartController): Router {
  const router = Router();
  router.get('/api/cart', controller.getCart);
  router.post('/api/cart/items', controller.addItem);
  router.patch('/api/cart/items/:sku', controller.updateQuantity);
  router.delete('/api/cart/items/:sku', controller.removeItem);
  return router;
}
