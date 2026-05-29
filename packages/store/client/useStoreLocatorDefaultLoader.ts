import { useCallback, useEffect, useState } from 'react';
import type { StoreResponse } from './store.api';
import { loadDefaultStores } from './loadStoreLocatorStores';

export function useStoreLocatorDefaultLoader() {
  const [stores, setStores] = useState<StoreResponse[]>([]);
  const [hasLocation, setHasLocation] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadDefault = useCallback(async () => {
    setLoading(true);
    setStores(await loadDefaultStores());
    setHasLocation(false);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadDefault();
  }, [loadDefault]);

  return { stores, setStores, hasLocation, setHasLocation, loading, setLoading, loadDefault };
}
