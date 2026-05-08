import { Router } from 'express';
import type { ProductCatalogController } from './product-catalog.controller';

export function createProductCatalogRouter(controller: ProductCatalogController): Router {
  const router = Router();

  router.get('/api/products/:sku', (req, res) => controller.getProductBySku(req, res));
  router.get('/api/products/:sku/stock', (req, res) => controller.getStockByProduct(req, res));

  router.get('/api/stock/:productSku/:storeCode', (req, res) => controller.getStockDetail(req, res));
  router.put('/api/stock/:productSku/:storeCode', (req, res) => controller.updateStock(req, res));

  router.post('/api/test/products', (req, res) => controller.seedProducts(req, res));
  router.delete('/api/test/products', (req, res) => controller.deleteProducts(req, res));

  router.post('/api/test/stock-availability', (req, res) => controller.seedStockAvailability(req, res));
  router.delete('/api/test/stock-availability', (req, res) => controller.deleteStockAvailability(req, res));

  router.post('/api/test/stock', (req, res) => controller.seedStock(req, res));
  router.delete('/api/test/stock', (req, res) => controller.deleteStock(req, res));

  return router;
}
