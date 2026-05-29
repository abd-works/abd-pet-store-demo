import React from 'react';
import type { StoreResponse } from './store.api';
import { formatDistance } from './storeLocatorUtils';
import { storeMapRowStyle } from './storeLocatorStyles';

interface StoreMapRowProps {
  store: StoreResponse;
  selected: boolean;
  onSelect: (store: StoreResponse) => void;
}

export function StoreMapRow({ store, selected, onSelect }: StoreMapRowProps) {
  return (
    <tr data-testid="store-map-point" style={storeMapRowStyle(selected)}>
      <td data-testid="store-name">{store.storeName}</td>
      <td>{formatDistance(store)}</td>
      <td>
        <button type="button" aria-label={`select ${store.storeName}`} onClick={() => onSelect(store)}>
          select store point
        </button>
      </td>
    </tr>
  );
}
