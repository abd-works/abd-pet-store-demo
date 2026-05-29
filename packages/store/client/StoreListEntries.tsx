import React from 'react';
import type { StoreResponse } from './store.api';
import { formatDistance, formatStoreAddress } from './storeLocatorUtils';
import {
  storeListAddressStyle,
  storeListDistanceStyle,
  storeListEntryStyle,
  storeListEntryTextStyle,
  storeListSelectStyle,
} from './storeLocatorStyles';

interface StoreListEntryProps {
  store: StoreResponse;
  selected: boolean;
  onSelect: (store: StoreResponse) => void;
}

export function StoreListEntry({ store, selected, onSelect }: StoreListEntryProps) {
  return (
    <li data-testid="store-list-entry" style={storeListEntryStyle(selected)}>
      <div style={storeListEntryTextStyle}>
        <strong data-testid="store-name">{store.storeName}</strong>
        <div style={storeListAddressStyle}>{formatStoreAddress(store)}</div>
        <div style={storeListDistanceStyle}>distance {formatDistance(store)}</div>
        <button
          type="button"
          style={storeListSelectStyle}
          aria-label={`select ${store.storeName}`}
          onClick={() => onSelect(store)}
        >
          select store row
        </button>
      </div>
    </li>
  );
}

interface StoreListEntriesProps {
  stores: StoreResponse[];
  selectedStore: StoreResponse | null;
  onSelect: (store: StoreResponse) => void;
}

export function StoreListEntries({ stores, selectedStore, onSelect }: StoreListEntriesProps) {
  return (
    <ul role="list" data-testid="store-list" aria-label="list view" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {stores.map((store) => (
        <StoreListEntry
          key={store.storeCode}
          store={store}
          selected={selectedStore?.storeCode === store.storeCode}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}
