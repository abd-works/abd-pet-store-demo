import type { StoreResponse } from './store.api';

export function formatDistance(store: StoreResponse): string {
  return store.distance_km !== undefined ? `${store.distance_km.toFixed(1)} km` : '—';
}

export function formatStoreAddress(store: StoreResponse): string {
  return [store.addressLineOne, store.city, store.postcode].filter(Boolean).join(', ');
}
