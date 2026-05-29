import type { Request, Response } from 'express';
import { HttpStatus } from '../../shared/http-status';
import type { RetailStoreCatalog } from './retail-store-catalog';

function respondNearestStores(catalog: RetailStoreCatalog, req: Request, res: Response): void {
  const stores = catalog.getStoresNearestFirst(
    Number(req.query.customerLatitude),
    Number(req.query.customerLongitude),
  );
  res.json({ stores });
}

function respondStoreList(catalog: RetailStoreCatalog, req: Request, res: Response): void {
  const { customerLatitude, customerLongitude, sort } = req.query;
  const hasLocation = customerLatitude !== undefined && customerLongitude !== undefined;
  if (hasLocation && sort === 'nearest') {
    respondNearestStores(catalog, req, res);
    return;
  }
  res.json({ stores: catalog.getAllStoresSortedByName() });
}

function respondStoreByCode(catalog: RetailStoreCatalog, req: Request, res: Response): void {
  const store = catalog.getStoreByCode(req.params.storeCode);
  if (!store) {
    res.status(HttpStatus.NOT_FOUND).json({ error: 'Store not found' });
    return;
  }
  res.json(store);
}

function respondDistance(catalog: RetailStoreCatalog, req: Request, res: Response): void {
  const { customerLatitude, customerLongitude } = req.query;
  if (customerLatitude === undefined || customerLongitude === undefined) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: 'customerLatitude and customerLongitude are required' });
    return;
  }

  const distance = catalog.calculateDistance(
    req.params.storeCode,
    Number(customerLatitude),
    Number(customerLongitude),
  );

  if (distance === undefined) {
    res.status(HttpStatus.NOT_FOUND).json({ error: 'Store not found' });
    return;
  }

  res.json({ distance_km: distance });
}

export class RetailStoreApi {
  constructor(private readonly catalog: RetailStoreCatalog) {}

  getStores = (req: Request, res: Response): void => respondStoreList(this.catalog, req, res);
  getStoreList = (_req: Request, res: Response): void => {
    res.json({ stores: this.catalog.getAllStoresSortedByName() });
  };
  getStoreByCode = (req: Request, res: Response): void => respondStoreByCode(this.catalog, req, res);
  getDistance = (req: Request, res: Response): void => respondDistance(this.catalog, req, res);

  seedStore = (req: Request, res: Response): void => {
    this.catalog.seedStore(req.body);
    res.status(HttpStatus.CREATED).json({ ok: true });
  };

  deleteStores = (req: Request, res: Response): void => {
    this.catalog.deleteStores(req.body.codes);
    res.status(HttpStatus.OK).json({ ok: true });
  };
}
