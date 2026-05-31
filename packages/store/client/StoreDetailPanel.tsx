import React, { useState } from 'react';
import type { StoreResponse } from './store.api';
import { MOCK_OPERATING_HOURS } from './mock-stores';
import { SetMyStoreGuestModal } from './SetMyStoreGuestModal';
import {
  panelStyle,
  storeDetailDistanceStyle,
  storeDetailHeaderStyle,
  storeDetailListStyle,
  storeDetailTermStyle,
  storeDetailTitleStyle,
  storeDetailValueStyle,
} from './storeLocatorStyles';
import { formatStoreAddress } from './storeLocatorUtils';

interface StoreDetailContactProps {
  phoneNumber: string;
  emailAddress: string;
}

function StoreDetailContact({ phoneNumber, emailAddress }: StoreDetailContactProps) {
  return (
    <dd style={storeDetailValueStyle}>
      <span data-testid="store-phone">{phoneNumber}</span>
      {' · '}
      <span data-testid="store-email">{emailAddress}</span>
    </dd>
  );
}

interface StoreDetailDistanceProps {
  distanceKm: number;
}

function StoreDetailDistance({ distanceKm }: StoreDetailDistanceProps) {
  return (
    <>
      <dt style={storeDetailTermStyle}>distance</dt>
      <dd data-testid="distance" style={storeDetailDistanceStyle}>{distanceKm.toFixed(1)} km</dd>
    </>
  );
}

interface StoreDetailPanelProps {
  store: StoreResponse;
  onClose: () => void;
  isLoggedIn?: boolean;
  isVerified?: boolean;
  preferredStoreCode?: string | null;
  onSetMyStore?: (storeCode: string) => Promise<void>;
}

export function StoreDetailPanel({
  store,
  onClose,
  isLoggedIn = false,
  isVerified = false,
  preferredStoreCode,
  onSetMyStore,
}: StoreDetailPanelProps) {
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const isCurrentPreferred = preferredStoreCode === store.storeCode;

  const handleSetMyStore = async () => {
    if (!isLoggedIn || !isVerified) {
      setGuestModalOpen(true);
      return;
    }
    if (!onSetMyStore || isCurrentPreferred) return;
    setSaving(true);
    try {
      await onSetMyStore(store.storeCode);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div data-testid="store-detail" style={panelStyle} aria-label="store detail panel">
      <div style={storeDetailHeaderStyle}>
        <h2 style={storeDetailTitleStyle}>{store.storeName}</h2>
        <button type="button" aria-label="close panel" onClick={onClose}>close panel</button>
      </div>
      <dl style={storeDetailListStyle}>
        <dt style={storeDetailTermStyle}>address</dt>
        <dd data-testid="store-address" style={storeDetailValueStyle}>{formatStoreAddress(store)}</dd>
        <dt style={storeDetailTermStyle}>operating hours</dt>
        <dd data-testid="operating-hours" style={storeDetailValueStyle}>{MOCK_OPERATING_HOURS}</dd>
        <dt style={storeDetailTermStyle}>contact details</dt>
        <StoreDetailContact phoneNumber={store.phoneNumber} emailAddress={store.emailAddress} />
        {store.distance_km !== undefined && <StoreDetailDistance distanceKm={store.distance_km} />}
      </dl>
      {isCurrentPreferred && (
        <p data-testid="current-preference-indicator">Your preferred store</p>
      )}
      <button
        type="button"
        data-testid="set-as-my-store"
        disabled={isCurrentPreferred || saving}
        onClick={() => void handleSetMyStore()}
        style={{ marginTop: 12, padding: '10px 16px', fontWeight: 600 }}
      >
        Set as My Store
      </button>
      <SetMyStoreGuestModal open={guestModalOpen} onClose={() => setGuestModalOpen(false)} />
    </div>
  );
}
