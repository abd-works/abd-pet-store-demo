import { Store, StoreLocator, type StoreData } from '@pawplace/store-shared';
import type { StoreRepository } from './store.repository';

function distanceForStore(
  storeCode: string,
  customerLatitude: number,
  customerLongitude: number,
  repository: StoreRepository,
): number | undefined {
  const store = repository.findByCode(storeCode);
  if (!store) return undefined;
  const locator = new StoreLocator([store]);
  return locator.calculateDistanceFromCustomer(store, customerLatitude, customerLongitude);
}

export class RetailStoreCatalog {
  constructor(private readonly repository: StoreRepository) {}

  getAllStoresSortedByName(): StoreData[] {
    const locator = new StoreLocator(this.repository.findAll());
    return locator.listView().map((store) => store.toData());
  }

  getAllStores(): StoreData[] {
    return this.repository.findAll()
      .filter((store) => store.activeStatus)
      .map((store) => store.toData());
  }

  getStoreByCode(storeCode: string): StoreData | undefined {
    return this.repository.findByCode(storeCode)?.toData();
  }

  getStoresNearestFirst(
    customerLatitude: number,
    customerLongitude: number,
  ): (StoreData & { distance_km: number })[] {
    const activeStores = this.repository.findAll().filter((store) => store.activeStatus);
    const locator = new StoreLocator(activeStores);
    return locator
      .sortNearestFirst(activeStores, customerLatitude, customerLongitude)
      .map(({ store, distance_km }) => ({ ...store.toData(), distance_km }));
  }

  calculateDistance(
    storeCode: string,
    customerLatitude: number,
    customerLongitude: number,
  ): number | undefined {
    return distanceForStore(storeCode, customerLatitude, customerLongitude, this.repository);
  }

  seedStore(data: StoreData): void {
    this.repository.save(Store.fromData(data));
  }

  deleteStores(codes: string[]): void {
    this.repository.deleteByCodes(codes);
  }
}
