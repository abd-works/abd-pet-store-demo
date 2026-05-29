import React from 'react';
import { Link } from 'react-router-dom';
import type { StoreStockDTO } from './product-catalog.api';
import { stockAvailabilityListStyle, storeStockRowStyle } from './stockAvailabilityDisplayStyles';

export function StoreStockRow({ store }: { store: StoreStockDTO }) {
  return (
    <li key={store.store_code} data-testid={`stock-${store.store_code}`} style={storeStockRowStyle}>
      <span>{store.store_name}</span>
      <span data-testid={`stock-label-${store.store_name}`}>{store.stock_label}</span>
      <Link to="/store-locator" data-testid={`select-store-${store.store_code}`}>
        select store link
      </Link>
    </li>
  );
}

interface StockAvailabilityListProps {
  stores: StoreStockDTO[];
}

export function StockAvailabilityList({ stores }: StockAvailabilityListProps) {
  return (
    <ul role="list" aria-label="stock availability by store" style={stockAvailabilityListStyle}>
      {stores.map((store) => (
        <StoreStockRow key={store.store_code} store={store} />
      ))}
    </ul>
  );
}
