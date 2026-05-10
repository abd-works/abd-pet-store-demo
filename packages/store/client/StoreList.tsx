import React, { useEffect, useState } from 'react';
import { fetchStores, fetchStoresNearby, type StoreResponse } from './store.api';

const POSTCODE_COORDS: Record<string, { latitude: number; longitude: number }> = {
  'M1 1AA': { latitude: 53.4794, longitude: -2.2453 },
};

function geocodePostcode(postcode: string): { latitude: number; longitude: number } | null {
  return POSTCODE_COORDS[postcode.toUpperCase().trim()] ?? null;
}

export function StoreList() {
  const [stores, setStores] = useState<StoreResponse[]>([]);
  const [postcode, setPostcode] = useState('');

  useEffect(() => {
    async function load() {
      const all = await fetchStores();
      if (all) {
        setStores([...all].sort((a, b) => a.storeName.localeCompare(b.storeName)));
      }
    }
    load();
  }, []);

  const handleShareLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      fetchStoresNearby(pos.coords.latitude, pos.coords.longitude)
        .then((results) => { if (results) setStores(results); });
    });
  };

  const handleFind = async () => {
    const coords = geocodePostcode(postcode);
    if (!coords) return;
    const results = await fetchStoresNearby(coords.latitude, coords.longitude);
    if (results) setStores(results);
  };

  if (stores.length === 0) return <p style={{ color: '#888' }}>Loading stores...</p>;

  return (
    <div data-testid="store-list">
      <button onClick={handleShareLocation}>Share Location</button>
      <div>
        <input
          aria-label="Postcode"
          value={postcode}
          onChange={e => setPostcode(e.target.value)}
        />
        <button onClick={handleFind}>Find</button>
      </div>
      {stores.map(store => (
        <div key={store.storeCode} data-testid="store-list-entry">
          <span data-testid="store-name">{store.storeName}</span>
          <span>{store.addressLineOne}</span>
          <span>{store.city}</span>
          <span>{store.postcode}</span>
          <span>{store.phoneNumber}</span>
          <span>{store.emailAddress}</span>
          {store.distance_km !== undefined && (
            <span data-testid="distance">{store.distance_km} km</span>
          )}
        </div>
      ))}
    </div>
  );
}
