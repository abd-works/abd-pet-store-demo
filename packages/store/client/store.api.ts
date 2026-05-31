import type { StoreData } from '@pawplace/store-shared';
import { storeSchema } from '@pawplace/store-shared';
import { performFetch } from '../../shared/http-io';
import { assertResponseOk, recoverWithMock } from '../../shared/http-client';
import { MOCK_STORES } from './mock-stores';

export interface StoreResponse extends StoreData {
  distance_km?: number;
  storeSpecializations?: string[];
}

interface StoreListPayload {
  stores: unknown[];
}

const readResponseJson = (response: Response): Promise<unknown> => response.json();

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (degrees: number) => (degrees * Math.PI) / 180;
  const deltaLatitude = toRad(lat2 - lat1);
  const deltaLongitude = toRad(lon2 - lon1);
  const angularDistance =
    Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(deltaLongitude / 2) ** 2;
  return Math.round(6371 * 2 * Math.atan2(Math.sqrt(angularDistance), Math.sqrt(1 - angularDistance)) * 10) / 10;
}

function sortWithDistance(stores: StoreResponse[], lat: number, lon: number): StoreResponse[] {
  return stores
    .map((store) => ({ ...store, distance_km: haversineKm(lat, lon, store.latitude, store.longitude) }))
    .sort((left, right) => (left.distance_km ?? 0) - (right.distance_km ?? 0));
}

function parseStoreList(payload: StoreListPayload): StoreResponse[] {
  return payload.stores.map((row) => {
    const result = storeSchema.safeParse(row);
    return result.success ? { ...result.data } : (row as StoreResponse);
  });
}

function loadAllStores(): Promise<StoreResponse[]> {
  return performFetch('/api/stores')
    .then((response) => {
      assertResponseOk(response, 'stores');
      return readResponseJson(response);
    })
    .then((raw) => parseStoreList(raw as StoreListPayload));
}

export function fetchStores(): Promise<StoreResponse[]> {
  return loadAllStores().catch((error) =>
    recoverWithMock('store.api', error, MOCK_STORES.map((store) => ({ ...store }))),
  );
}

function nearbyStoreUrl(customerLatitude: number, customerLongitude: number): string {
  const params = new URLSearchParams({
    customerLatitude: String(customerLatitude),
    customerLongitude: String(customerLongitude),
    sort: 'nearest',
  });
  return `/api/stores?${params}`;
}

function loadNearbyStores(customerLatitude: number, customerLongitude: number): Promise<StoreResponse[]> {
  return performFetch(nearbyStoreUrl(customerLatitude, customerLongitude))
    .then((response) => {
      assertResponseOk(response, 'nearby stores');
      return readResponseJson(response);
    })
    .then((raw) => (raw as StoreListPayload).stores as StoreResponse[]);
}

export function fetchStoresNearby(
  customerLatitude?: number,
  customerLongitude?: number,
): Promise<StoreResponse[] | undefined> {
  if (customerLatitude == null || customerLongitude == null) return Promise.resolve(undefined);
  return loadNearbyStores(customerLatitude, customerLongitude).catch((error) =>
    recoverWithMock('store.api', error, sortWithDistance(MOCK_STORES, customerLatitude, customerLongitude)),
  );
}
