import { fetchStores, fetchStoresNearby, type StoreResponse } from './store.api';

export async function loadDefaultStores(): Promise<StoreResponse[]> {
  const all = await fetchStores();
  return [...all].sort((left, right) => left.storeName.localeCompare(right.storeName));
}

export async function loadNearbyStores(latitude: number, longitude: number): Promise<StoreResponse[] | null> {
  return fetchStoresNearby(latitude, longitude);
}
