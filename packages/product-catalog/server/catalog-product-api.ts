import type { Request, Response } from 'express';
import { HttpStatus } from '../../shared/http-status';
import { NegativeQuantityError } from '../shared/stockAvailabilityErrors';
import type { CatalogProductBrowse } from './catalog-product-browse';
import type { CatalogStockLevels } from './catalog-stock-levels';

function readCategoryFilter(req: Request): string | undefined {
  return typeof req.query.category === 'string' ? req.query.category : undefined;
}

function respondProductList(browse: CatalogProductBrowse, req: Request, res: Response): void {
  res.json({ products: browse.browseProducts(readCategoryFilter(req)) });
}

function respondProductBySku(browse: CatalogProductBrowse, req: Request, res: Response): void {
  const product = browse.getProductBySku(req.params.sku);
  if (!product) {
    res.status(HttpStatus.NOT_FOUND).json({ error: 'Product not found' });
    return;
  }
  res.json(product);
}

function respondStockByProduct(stock: CatalogStockLevels, req: Request, res: Response): void {
  res.json({ stores: stock.getStockAvailabilityByProduct(req.params.sku) });
}

function respondStockDetail(stock: CatalogStockLevels, req: Request, res: Response): void {
  const detail = stock.getStockDetail(req.params.productSku, req.params.storeCode);
  if (!detail) {
    res.status(HttpStatus.NOT_FOUND).json({ error: 'Stock not found' });
    return;
  }
  res.json(detail);
}

function respondStockUpdate(stock: CatalogStockLevels, req: Request, res: Response): void {
  try {
    const result = stock.updateStockQuantity(
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
      res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
      return;
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
}

export class CatalogProductApi {
  constructor(
    private readonly browse: CatalogProductBrowse,
    private readonly stock: CatalogStockLevels,
  ) {}

  listProducts = (req: Request, res: Response): void => respondProductList(this.browse, req, res);
  getProductBySku = (req: Request, res: Response): void => respondProductBySku(this.browse, req, res);
  getStockByProduct = (req: Request, res: Response): void => respondStockByProduct(this.stock, req, res);
  getStockDetail = (req: Request, res: Response): void => respondStockDetail(this.stock, req, res);
  updateStock = (req: Request, res: Response): void => respondStockUpdate(this.stock, req, res);
}
