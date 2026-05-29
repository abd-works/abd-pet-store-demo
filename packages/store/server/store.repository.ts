import { Store } from '../shared/Store';
import { storeSchema } from '../shared/store.schema';

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
    storeSchema.parse(store.toData());
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
