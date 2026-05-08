import { Store, type StoreData } from '@pawplace/store-shared';

export interface StoreRepository {
  findAll(): Store[];
  findByCode(storeCode: string): Store | undefined;
  save(store: Store): void;
  deleteByCode(storeCode: string): void;
  deleteByCodes(codes: string[]): void;
}

export class InMemoryStoreRepository implements StoreRepository {
  private readonly stores = new Map<string, Store>();

  findAll(): Store[] {
    return Array.from(this.stores.values());
  }

  findByCode(storeCode: string): Store | undefined {
    return this.stores.get(storeCode);
  }

  save(store: Store): void {
    this.stores.set(store.storeCode, store);
  }

  deleteByCode(storeCode: string): void {
    this.stores.delete(storeCode);
  }

  deleteByCodes(codes: string[]): void {
    for (const code of codes) {
      this.stores.delete(code);
    }
  }
}
