import type { Store } from './Store';
import { activeStoreLocator } from './storeLocatorFactory';
import type { SharedLocation } from './store.schema';

const EARTH_RADIUS_KM = 6371;

export interface StoreWithDistance {
  store: Store;
  distance_km: number;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number,
): number {
  const deltaLatitude = toRadians(lat2 - lat1);
  const deltaLongitude = toRadians(lon2 - lon1);
  const angularDistance =
    Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(deltaLongitude / 2) ** 2;
  const greatCircleRadians = 2 * Math.atan2(Math.sqrt(angularDistance), Math.sqrt(1 - angularDistance));
  return Math.round(EARTH_RADIUS_KM * greatCircleRadians * 10) / 10;
}

export class StoreLocator {
  readonly stores: Store[];
  sharedLocationInput: SharedLocation | null = null;
  postcodeInput: string | null = null;

  constructor(stores: Store[]) {
    this.stores = [...stores];
  }

  static loadActiveStores(stores: Store[]): StoreLocator {
    return activeStoreLocator(stores);
  }

  openMapView(): Store[] {
    return this.mapView();
  }

  mapView(): Store[] {
    return this.showAllStoresWithoutSearch();
  }

  listView(): Store[] {
    return this.storesInDefaultOrder();
  }

  showAllStoresWithoutSearch(): Store[] {
    return [...this.stores].filter(s => s.activeStatus);
  }

  storesInDefaultOrder(): Store[] {
    return this.showAllStoresWithoutSearch()
      .sort((a, b) => a.storeName.localeCompare(b.storeName));
  }

  calculateDistanceFromCustomer(
    store: Store,
    customerLatitude?: number,
    customerLongitude?: number,
  ): number {
    const lat = customerLatitude ?? this.sharedLocationInput?.latitude;
    const lon = customerLongitude ?? this.sharedLocationInput?.longitude;
    if (lat === undefined || lon === undefined) {
      throw new Error('Customer location required — set sharedLocationInput or pass coordinates');
    }
    return haversineDistance(lat, lon, store.latitude, store.longitude);
  }

  sortNearestFirst(
    stores?: Store[],
    customerLatitude?: number,
    customerLongitude?: number,
  ): StoreWithDistance[] {
    const targetStores = stores ?? this.stores.filter(s => s.activeStatus);
    return targetStores
      .map(store => ({
        store,
        distance_km: this.calculateDistanceFromCustomer(
          store, customerLatitude, customerLongitude,
        ),
      }))
      .sort((a, b) => a.distance_km - b.distance_km);
  }

  filterByDistance(
    customerLatitude: number,
    customerLongitude: number,
    maxDistanceKm: number,
  ): StoreWithDistance[] {
    return this.sortNearestFirst(
      this.stores.filter(s => s.activeStatus),
      customerLatitude,
      customerLongitude,
    ).filter(entry => entry.distance_km <= maxDistanceKm);
  }
}
