import { Router } from 'express';
import type { ProductSearchController } from './product-search.controller';

export function createProductSearchRouter(controller: ProductSearchController): Router {
  const router = Router();
  router.get('/api/products/search', controller.search);
  return router;
}
