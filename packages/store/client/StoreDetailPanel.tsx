import React from 'react';
import { MOCK_OPERATING_HOURS } from './mock-stores';
import type { StoreResponse } from './store.api';
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
}

export function StoreDetailPanel({ store, onClose }: StoreDetailPanelProps) {
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
    </div>
  );
}
