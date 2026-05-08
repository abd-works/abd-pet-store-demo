import React, { useEffect, useState } from 'react';
import { fetchStores, type StoreResponse } from './store.api';

export function StoreMap() {
  const [stores, setStores] = useState<StoreResponse[]>([]);
  const [selectedStore, setSelectedStore] = useState<StoreResponse | null>(null);

  useEffect(() => {
    fetchStores().then(setStores);
  }, []);

  if (stores.length === 0) return null;

  return (
    <div data-testid="store-map">
      {stores.map(store => (
        <button
          key={store.storeCode}
          aria-label={store.storeName}
          onClick={() => setSelectedStore(store)}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {store.storeName}
        </button>
      ))}
      {selectedStore && (
        <div data-testid="store-detail">
          <span>{selectedStore.addressLineOne}</span>
          <span>{selectedStore.city}</span>
          <span>{selectedStore.postcode}</span>
          <span>{selectedStore.phoneNumber}</span>
          <span>{selectedStore.emailAddress}</span>
        </div>
      )}
    </div>
  );
}
