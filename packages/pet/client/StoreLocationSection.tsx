import React from 'react';
import { Link } from 'react-router-dom';

interface StoreLocationSectionProps {
  storeCode: string;
  storeName: string;
  storeAddress: string;
  storeHours: string;
  distanceKm?: number | null;
  onRequestLocation?: () => void;
}

export function StoreLocationSection({
  storeCode,
  storeName,
  storeAddress,
  storeHours,
  distanceKm,
  onRequestLocation,
}: StoreLocationSectionProps) {
  return (
    <section aria-label="store location" style={{ marginTop: 16 }}>
      <h2 style={{ fontSize: 16, marginBottom: 8 }}>store location</h2>
      <p style={{ marginBottom: 4 }}>
        <strong>store: </strong>
        <Link to={`/stores/${storeCode}`} aria-label={`View ${storeName} store detail`}>
          {storeName}
        </Link>
      </p>
      <p aria-label="store address" style={{ marginBottom: 4 }}>{storeAddress}</p>
      <p aria-label="operating hours" style={{ marginBottom: 4, fontSize: 13, color: '#555' }}>{storeHours}</p>
      {distanceKm != null ? (
        <p aria-label="distance to store" style={{ fontSize: 13, color: '#555' }}>
          {distanceKm.toFixed(1)} km away
        </p>
      ) : (
        <p style={{ fontSize: 13, color: '#777' }}>
          distance unavailable —{' '}
          {onRequestLocation ? (
            <button
              type="button"
              onClick={onRequestLocation}
              style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', textDecoration: 'underline', fontSize: 13, padding: 0 }}
            >
              share your location
            </button>
          ) : (
            'enter your postcode to see distance'
          )}
        </p>
      )}
    </section>
  );
}
