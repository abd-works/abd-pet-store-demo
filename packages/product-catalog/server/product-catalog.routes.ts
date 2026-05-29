import { Router } from 'express';
import type { CatalogProductApi } from './catalog-product-api';
import type { CatalogFixtureApi } from './catalog-fixture-api';

function registerProductRoutes(router: Router, api: CatalogProductApi): void {
  router.get('/api/products', api.listProducts);
  router.get('/api/products/:sku', api.getProductBySku);
  router.get('/api/products/:sku/stock', api.getStockByProduct);
  router.get('/api/stock/:productSku/:storeCode', api.getStockDetail);
  router.put('/api/stock/:productSku/:storeCode', api.updateStock);
}

function registerFixtureRoutes(router: Router, api: CatalogFixtureApi): void {
  router.post('/api/test/products', api.seedProducts);
  router.delete('/api/test/products', api.deleteProducts);
  router.post('/api/test/stock-availability', api.seedStockAvailability);
  router.delete('/api/test/stock-availability', api.deleteStockAvailability);
  router.post('/api/test/stock', api.seedStock);
  router.delete('/api/test/stock', api.deleteStock);
}

export function createProductCatalogRouter(
  productApi: CatalogProductApi,
  fixtureApi: CatalogFixtureApi,
): Router {
  const router = Router();
  registerProductRoutes(router, productApi);
  registerFixtureRoutes(router, fixtureApi);
  return router;
}
