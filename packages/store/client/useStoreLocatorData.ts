import { useState } from 'react';
import type { StoreResponse } from './store.api';
import { useStoreLocatorDefaultLoader } from './useStoreLocatorDefaultLoader';

export function useStoreLocatorData() {
  const defaults = useStoreLocatorDefaultLoader();
  const [selectedStore, setSelectedStore] = useState<StoreResponse | null>(null);
  const [postcode, setPostcode] = useState('');

  return {
    stores: defaults.stores,
    setStores: defaults.setStores,
    selectedStore,
    setSelectedStore,
    postcode,
    setPostcode,
    hasLocation: defaults.hasLocation,
    setHasLocation: defaults.setHasLocation,
    loading: defaults.loading,
    setLoading: defaults.setLoading,
    loadDefault: defaults.loadDefault,
  };
}

export type StoreLocatorData = ReturnType<typeof useStoreLocatorData>;
