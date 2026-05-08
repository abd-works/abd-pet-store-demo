import React, { useEffect, useState } from 'react';
import { fetchStockAvailability, type StoreStockDTO } from './product-catalog.api';

interface StockAvailabilityDisplayProps {
  productSku: string;
}

export function StockAvailabilityDisplay({ productSku }: StockAvailabilityDisplayProps) {
  const [stores, setStores] = useState<StoreStockDTO[]>([]);

  useEffect(() => {
    fetchStockAvailability(productSku).then(setStores);
  }, [productSku]);

  if (stores.length === 0) return null;

  return (
    <div>
      {stores.map((store) => (
        <div key={store.store_code} data-testid={`stock-${store.store_code}`}>
          <span data-testid={`stock-label-${store.store_name}`}>
            {store.stock_label}
          </span>
          <span>{store.available_to_sell_quantity}</span>
        </div>
      ))}
    </div>
  );
}
