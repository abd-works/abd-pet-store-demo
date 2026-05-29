import type { StoreData } from './store.schema';
import { storeSchema } from './store.schema';
import { Store } from './Store';

export function storeFromValidatedData(data: StoreData): Store {
  const parsed = storeSchema.parse(data);
  return new Store(parsed.storeName, parsed.storeCode, parsed);
}
