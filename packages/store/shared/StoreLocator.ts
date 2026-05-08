import type { Store } from './Store';

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
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(EARTH_RADIUS_KM * c * 10) / 10;
}

export class StoreLocator {
  constructor(private readonly stores: Store[]) {}

  mapView(): Store[] {
    return [...this.stores].filter(s => s.activeStatus);
  }

  listView(): Store[] {
    return [...this.stores]
      .filter(s => s.activeStatus)
      .sort((a, b) => a.storeName.localeCompare(b.storeName));
  }

  calculateDistanceFromCustomer(
    store: Store,
    customerLatitude: number,
    customerLongitude: number,
  ): number {
    return haversineDistance(
      customerLatitude, customerLongitude,
      store.latitude, store.longitude,
    );
  }

  sortNearestFirst(
    stores: Store[],
    customerLatitude: number,
    customerLongitude: number,
  ): StoreWithDistance[] {
    return stores
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
