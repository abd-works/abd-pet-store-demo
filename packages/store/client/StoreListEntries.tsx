import React, { useState } from 'react';
import type { StoreResponse } from './store.api';
import { formatDistance, formatStoreAddress } from './storeLocatorUtils';
import {
  storeListAddressStyle,
  storeListDistanceStyle,
  storeListEntryStyle,
  storeListSelectStyle,
  storeListEntryTextStyle,
} from './storeLocatorStyles';

interface StoreListEntryProps {
  store: StoreResponse;
  selected: boolean;
  preferredStoreCode?: string | null;
  onSelect: (store: StoreResponse) => void;
}

export function StoreListEntry({ store, selected, preferredStoreCode, onSelect }: StoreListEntryProps) {
  const isPreferred = preferredStoreCode === store.storeCode;

  return (
    <li
      data-testid="store-list-entry"
      data-preferred={isPreferred ? 'true' : 'false'}
      style={{
        ...storeListEntryStyle(selected),
        borderLeft: isPreferred ? '4px solid #111' : undefined,
        paddingLeft: isPreferred ? 8 : undefined,
      }}
    >
      <div style={storeListEntryTextStyle}>
        <strong data-testid="store-name">{store.storeName}</strong>
        {isPreferred && (
          <span data-testid="preferred-store-badge" aria-label="your preferred store">
            ★ your preferred store
          </span>
        )}
        <div style={storeListAddressStyle}>{formatStoreAddress(store)}</div>
        {(store.storeSpecializations ?? []).length > 0 && (
          <div data-testid="specialization-badges" style={{ marginTop: 4, fontSize: 12 }}>
            {(store.storeSpecializations ?? []).join(' · ')}
          </div>
        )}
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
  preferredStoreCode?: string | null;
  onSelect: (store: StoreResponse) => void;
}

export function StoreListEntries({
  stores,
  selectedStore,
  preferredStoreCode,
  onSelect,
}: StoreListEntriesProps) {
  return (
    <ul role="list" data-testid="store-list" aria-label="list view" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {stores.map((store) => (
        <StoreListEntry
          key={store.storeCode}
          store={store}
          selected={selectedStore?.storeCode === store.storeCode}
          preferredStoreCode={preferredStoreCode}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}
