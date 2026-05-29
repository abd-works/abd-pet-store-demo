import type { Request, Response } from 'express';
import { HttpStatus } from '../../shared/http-status';
import type { CatalogFixtureLoader } from './catalog-fixture-loader';

export class CatalogFixtureApi {
  constructor(private readonly fixtures: CatalogFixtureLoader) {}

  seedProducts = (req: Request, res: Response): void => {
    this.fixtures.seedProduct(req.body);
    res.status(HttpStatus.CREATED).json({ sku: req.body.sku });
  };

  deleteProducts = (req: Request, res: Response): void => {
    this.fixtures.deleteProducts(req.body.skus);
    res.status(HttpStatus.OK).json({ deleted: req.body.skus });
  };

  seedStockAvailability = (req: Request, res: Response): void => {
    const ids = this.fixtures.seedStockAvailabilityBatch(req.body);
    res.status(HttpStatus.CREATED).json({ ids });
  };

  deleteStockAvailability = (req: Request, res: Response): void => {
    this.fixtures.deleteStockAvailability(req.body.ids);
    res.status(HttpStatus.OK).json({ deleted: req.body.ids });
  };

  seedStock = (req: Request, res: Response): void => {
    this.fixtures.seedStock(req.body);
    res.status(HttpStatus.CREATED).json({ key: `${req.body.product_sku}:${req.body.store_code}` });
  };

  deleteStock = (req: Request, res: Response): void => {
    this.fixtures.deleteStockByKeys(req.body.keys);
    res.status(HttpStatus.OK).json({ deleted: req.body.keys });
  };
}
