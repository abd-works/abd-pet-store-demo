import type { Request, Response } from 'express';
import type { StoreService } from './store.service';

export class StoreController {
  constructor(private readonly service: StoreService) {}

  getStores = (req: Request, res: Response): void => {
    const { customerLatitude, customerLongitude, sort } = req.query;
    const hasLocation = customerLatitude !== undefined && customerLongitude !== undefined;

    if (hasLocation && sort === 'nearest') {
      const stores = this.service.getStoresNearestFirst(
        Number(customerLatitude),
        Number(customerLongitude),
      );
      res.json({ stores });
      return;
    }

    const stores = this.service.getAllStoresSortedByName();
    res.json({ stores });
  };

  getStoreList = (_req: Request, res: Response): void => {
    const stores = this.service.getAllStoresSortedByName();
    res.json({ stores });
  };

  getStoreByCode = (req: Request, res: Response): void => {
    const store = this.service.getStoreByCode(req.params.storeCode);
    if (!store) {
      res.status(404).json({ error: 'Store not found' });
      return;
    }
    res.json(store);
  };

  getDistance = (req: Request, res: Response): void => {
    const { customerLatitude, customerLongitude } = req.query;
    if (customerLatitude === undefined || customerLongitude === undefined) {
      res.status(400).json({ error: 'customerLatitude and customerLongitude are required' });
      return;
    }

    const distance = this.service.calculateDistance(
      req.params.storeCode,
      Number(customerLatitude),
      Number(customerLongitude),
    );

    if (distance === undefined) {
      res.status(404).json({ error: 'Store not found' });
      return;
    }

    res.json({ distance_km: distance });
  };

  seedStore = (req: Request, res: Response): void => {
    this.service.seedStore(req.body);
    res.status(201).json({ ok: true });
  };

  deleteStores = (req: Request, res: Response): void => {
    this.service.deleteStores(req.body.codes);
    res.status(200).json({ ok: true });
  };
}
