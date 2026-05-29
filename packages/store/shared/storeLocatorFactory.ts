import type { Store } from './Store';
import { StoreLocator } from './StoreLocator';

export function activeStoreLocator(stores: Store[]): StoreLocator {
  const activeStores = stores.filter((store) => store.activeStatus);
  return new StoreLocator(activeStores);
}
