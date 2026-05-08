import { Store, StoreLocator, type StoreData } from '@pawplace/store-shared';
import type { StoreRepository } from './store.repository';

export class StoreService {
  constructor(private readonly repository: StoreRepository) {}

  getAllStoresSortedByName(): StoreData[] {
    const locator = new StoreLocator(this.repository.findAll());
    return locator.listView().map(s => s.toData());
  }

  getAllStores(): StoreData[] {
    return this.repository.findAll()
      .filter(s => s.activeStatus)
      .map(s => s.toData());
  }

  getStoreByCode(storeCode: string): StoreData | undefined {
    return this.repository.findByCode(storeCode)?.toData();
  }

  getStoresNearestFirst(
    customerLatitude: number,
    customerLongitude: number,
  ): (StoreData & { distance_km: number })[] {
    const allStores = this.repository.findAll().filter(s => s.activeStatus);
    const locator = new StoreLocator(allStores);
    return locator
      .sortNearestFirst(allStores, customerLatitude, customerLongitude)
      .map(({ store, distance_km }) => ({ ...store.toData(), distance_km }));
  }

  calculateDistance(
    storeCode: string,
    customerLatitude: number,
    customerLongitude: number,
  ): number | undefined {
    const store = this.repository.findByCode(storeCode);
    if (!store) return undefined;

    const locator = new StoreLocator([store]);
    return locator.calculateDistanceFromCustomer(
      store, customerLatitude, customerLongitude,
    );
  }

  seedStore(data: StoreData): void {
    this.repository.save(Store.fromData(data));
  }

  deleteStores(codes: string[]): void {
    this.repository.deleteByCodes(codes);
  }
}
