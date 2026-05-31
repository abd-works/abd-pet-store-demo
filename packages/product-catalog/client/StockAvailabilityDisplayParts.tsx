import React from 'react';
import { Link } from 'react-router-dom';
import type { StoreStockDTO } from './product-catalog.api';
import { stockAvailabilityListStyle, storeStockRowStyle } from './stockAvailabilityDisplayStyles';

export function StoreStockRow({
  store,
  isPreferred,
}: {
  store: StoreStockDTO;
  isPreferred?: boolean;
}) {
  return (
    <li
      key={store.store_code}
      data-testid={`stock-${store.store_code}`}
      data-preferred={isPreferred ? 'true' : 'false'}
      style={storeStockRowStyle}
    >
      <span>{store.store_name}</span>
      {isPreferred && <span data-testid="preferred-stock-store"> (my store)</span>}
      <span data-testid={`stock-label-${store.store_name}`}>{store.stock_label}</span>
      <Link to="/store-locator" data-testid={`select-store-${store.store_code}`}>
        select store link
      </Link>
    </li>
  );
}

interface StockAvailabilityListProps {
  stores: StoreStockDTO[];
  preferredStoreCode?: string | null;
}

export function StockAvailabilityList({ stores, preferredStoreCode }: StockAvailabilityListProps) {
  return (
    <ul role="list" aria-label="stock availability by store" style={stockAvailabilityListStyle}>
      {stores.map((store) => (
        <StoreStockRow
          key={store.store_code}
          store={store}
          isPreferred={preferredStoreCode === store.store_code}
        />
      ))}
    </ul>
  );
}
