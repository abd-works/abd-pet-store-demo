import React, { useCallback, useEffect, useState } from 'react';
import { clearMyStore, fetchMyStore, setMyStore } from './my-store.api';

export function useMyStorePreference(isLoggedIn: boolean, isVerified: boolean) {
  const [storeCode, setStoreCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isLoggedIn || !isVerified) {
      setStoreCode(null);
      return;
    }
    setLoading(true);
    try {
      const response = await fetchMyStore();
      setStoreCode(response.storeCode);
    } catch {
      setStoreCode(null);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, isVerified]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const save = useCallback(async (nextStoreCode: string) => {
    const response = await setMyStore(nextStoreCode);
    setStoreCode(response.storeCode);
    return response.storeCode;
  }, []);

  const clear = useCallback(async () => {
    const response = await clearMyStore();
    setStoreCode(response.storeCode);
  }, []);

  return { storeCode, loading, refresh, save, clear };
}
