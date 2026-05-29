export interface StoreRecord {
  storeCode: string;
  storeName: string;
  addressLineOne: string;
  city: string;
  postcode: string;
  latitude: number;
  longitude: number;
}

export class InMemoryStoreRegistry {
  private stores = new Map<string, StoreRecord>();

  add(store: StoreRecord): void {
    this.stores.set(store.storeCode, store);
  }

  get(storeCode: string): StoreRecord | undefined {
    return this.stores.get(storeCode);
  }

  resolveStoreName(storeCode: string): string {
    const store = this.stores.get(storeCode);
    return store?.storeName ?? `Unknown Store (${storeCode})`;
  }

  resolveStoreAddress(storeCode: string): string | null {
    const store = this.stores.get(storeCode);
    if (!store) return null;
    return `${store.addressLineOne}, ${store.city}, ${store.postcode}`;
  }

  deleteMany(codes: string[]): void {
    for (const code of codes) this.stores.delete(code);
  }

  clear(): void {
    this.stores.clear();
  }
}
