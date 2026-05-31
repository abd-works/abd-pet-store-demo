import React from 'react';
import { Link } from 'react-router-dom';
import { useMyStorePreference } from './useMyStorePreference';
import { MOCK_STORES } from '../../store/client/mock-stores';

export interface MyStorePreferenceViewProps {
  isLoggedIn: boolean;
  isVerified: boolean;
}

export function MyStorePreferenceView({ isLoggedIn, isVerified }: MyStorePreferenceViewProps) {
  const { storeCode, loading, clear } = useMyStorePreference(isLoggedIn, isVerified);
  const currentStore = MOCK_STORES.find((store) => store.storeCode === storeCode);

  if (!isLoggedIn || !isVerified) {
    return (
      <div data-testid="my-store-guest-state">
        <p>log in or register to set my store</p>
        <Link to="/login?returnTo=%2Faccount%2Fmy-store">Log In</Link>
      </div>
    );
  }

  if (loading) return <p>Loading my store preference...</p>;

  if (!storeCode || !currentStore) {
    return (
      <div data-testid="my-store-unset-state">
        <p>No preferred store set</p>
        <Link to="/stores">Browse stores</Link>
      </div>
    );
  }

  return (
    <div data-testid="my-store-preference-form">
      <p>
        current my store name:
        {' '}
        <strong data-testid="current-my-store-name">{currentStore.storeName}</strong>
      </p>
      <p>
        <Link to="/stores">Change store</Link>
      </p>
      <button type="button" onClick={() => void clear()}>
        Clear preference
      </button>
    </div>
  );
}
