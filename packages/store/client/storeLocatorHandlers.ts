import type { StoreLocatorData } from './useStoreLocatorData';
import { loadNearbyStores } from './loadStoreLocatorStores';

export function createShareLocationHandler(storeLocatorData: StoreLocatorData) {
  return () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (position) => {
      storeLocatorData.setLoading(true);
      const results = await loadNearbyStores(position.coords.latitude, position.coords.longitude);
      if (results) {
        storeLocatorData.setStores(results);
        storeLocatorData.setHasLocation(true);
      }
      storeLocatorData.setLoading(false);
    });
  };
}

export function createFindByPostcodeHandler(storeLocatorData: StoreLocatorData) {
  return async (
    lookupPostcode: string,
    geocode: (value: string) => { latitude: number; longitude: number } | null,
  ) => {
    const coords = geocode(lookupPostcode);
    if (!coords) return;
    storeLocatorData.setLoading(true);
    const results = await loadNearbyStores(coords.latitude, coords.longitude);
    if (results) {
      storeLocatorData.setStores(results);
      storeLocatorData.setHasLocation(true);
    }
    storeLocatorData.setLoading(false);
  };
}

export function createClearLocationHandler(storeLocatorData: StoreLocatorData) {
  return () => {
    storeLocatorData.setPostcode('');
    storeLocatorData.setSelectedStore(null);
    storeLocatorData.loadDefault();
  };
}
