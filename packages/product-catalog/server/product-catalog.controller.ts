import type { Request, Response } from 'express';
import { NegativeQuantityError } from '../shared/StockAvailability';
import type { ProductCatalogService } from './product-catalog.service';

export class ProductCatalogController {
  constructor(private readonly service: ProductCatalogService) {}

  getProductBySku(req: Request, res: Response): void {
    const product = this.service.getProductBySku(req.params.sku);
    if (!product) { res.status(404).json({ error: 'Product not found' }); return; }
    res.json(product);
  }

  getStockByProduct(req: Request, res: Response): void {
    const stores = this.service.getStockAvailabilityByProduct(req.params.sku);
    res.json({ stores });
  }

  getStockDetail(req: Request, res: Response): void {
    const detail = this.service.getStockDetail(req.params.productSku, req.params.storeCode);
    if (!detail) { res.status(404).json({ error: 'Stock not found' }); return; }
    res.json(detail);
  }

  updateStock(req: Request, res: Response): void {
    try {
      const result = this.service.updateStockQuantity(
        req.params.productSku,
        req.params.storeCode,
        req.body.quantity_on_hand,
      );
      res.json({
        ...result,
        available_to_sell_quantity: result.availableToSellQuantity,
      });
    } catch (error) {
      if (error instanceof NegativeQuantityError) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  seedProducts(req: Request, res: Response): void {
    this.service.seedProduct(req.body);
    res.status(201).json({ sku: req.body.sku });
  }

  deleteProducts(req: Request, res: Response): void {
    this.service.deleteProducts(req.body.skus);
    res.status(200).json({ deleted: req.body.skus });
  }

  seedStockAvailability(req: Request, res: Response): void {
    const ids = this.service.seedStockAvailabilityBatch(req.body);
    res.status(201).json({ ids });
  }

  deleteStockAvailability(req: Request, res: Response): void {
    this.service.deleteStockAvailability(req.body.ids);
    res.status(200).json({ deleted: req.body.ids });
  }

  seedStock(req: Request, res: Response): void {
    this.service.seedStock(req.body);
    res.status(201).json({ key: `${req.body.product_sku}:${req.body.store_code}` });
  }

  deleteStock(req: Request, res: Response): void {
    this.service.deleteStockByKeys(req.body.keys);
    res.status(200).json({ deleted: req.body.keys });
  }
}
