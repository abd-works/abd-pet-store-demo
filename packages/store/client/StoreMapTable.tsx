import React from 'react';
import type { StoreResponse } from './store.api';
import { storeMapHeaderRowStyle, storeMapTableStyle } from './storeLocatorStyles';
import { StoreMapRow } from './StoreMapRow';

function StoreMapTableHead() {
  return (
    <thead>
      <tr style={storeMapHeaderRowStyle}>
        <th scope="col">store name</th>
        <th scope="col">distance</th>
        <th scope="col">select store point</th>
      </tr>
    </thead>
  );
}

interface StoreMapTableBodyProps {
  stores: StoreResponse[];
  selectedStore: StoreResponse | null;
  onSelect: (store: StoreResponse) => void;
}

function StoreMapTableBody({ stores, selectedStore, onSelect }: StoreMapTableBodyProps) {
  return (
    <tbody>
      {stores.map((store) => (
        <StoreMapRow
          key={store.storeCode}
          store={store}
          selected={selectedStore?.storeCode === store.storeCode}
          onSelect={onSelect}
        />
      ))}
    </tbody>
  );
}

interface StoreMapTableProps {
  stores: StoreResponse[];
  selectedStore: StoreResponse | null;
  onSelect: (store: StoreResponse) => void;
}

export function StoreMapTable({ stores, selectedStore, onSelect }: StoreMapTableProps) {
  return (
    <table data-testid="store-map" aria-label="map view store points" style={storeMapTableStyle}>
      <StoreMapTableHead />
      <StoreMapTableBody stores={stores} selectedStore={selectedStore} onSelect={onSelect} />
    </table>
  );
}
