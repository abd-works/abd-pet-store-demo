import type { StoreData } from '@pawplace/store-shared';

export interface StoreResponse extends StoreData {
  distance_km?: number;
}

export async function fetchStores(): Promise<StoreResponse[]> {
  const response = await fetch('/api/stores');
  if (!response.ok) throw new Error(`Failed to fetch stores: ${response.status}`);
  const body = await response.json();
  return body.stores;
}

export async function fetchStoresNearby(
  customerLatitude?: number,
  customerLongitude?: number,
): Promise<StoreResponse[] | undefined> {
  if (customerLatitude == null || customerLongitude == null) return undefined;

  const params = new URLSearchParams({
    customerLatitude: String(customerLatitude),
    customerLongitude: String(customerLongitude),
    sort: 'nearest',
  });
  const response = await fetch(`/api/stores?${params}`);
  if (!response.ok) throw new Error(`Failed to fetch nearby stores: ${response.status}`);
  const body = await response.json();
  return body.stores;
}
