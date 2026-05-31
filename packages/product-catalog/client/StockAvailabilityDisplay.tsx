import React, { useEffect, useMemo, useState } from 'react';
import { fetchStockAvailability, type StoreStockDTO } from './product-catalog.api';
import { StockAvailabilityList } from './StockAvailabilityDisplayParts';

interface StockAvailabilityDisplayProps {
  productSku: string;
  preferredStoreCode?: string | null;
}

export function StockAvailabilityDisplay({ productSku, preferredStoreCode }: StockAvailabilityDisplayProps) {
  const [stores, setStores] = useState<StoreStockDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchStockAvailability(productSku).then((rows) => {
      setStores(rows);
      setLoading(false);
    });
  }, [productSku]);

  const orderedStores = useMemo(() => {
    if (!preferredStoreCode) return stores;
    const preferred = stores.filter((store) => store.store_code === preferredStoreCode);
    const rest = stores.filter((store) => store.store_code !== preferredStoreCode);
    return [...preferred, ...rest];
  }, [stores, preferredStoreCode]);

  if (loading) return <p style={{ color: '#888' }}>Loading stock availability...</p>;
  if (stores.length === 0) return <p>No stock availability data.</p>;

  return (
    <div data-testid="stock-availability-display" data-preferred-store={preferredStoreCode ?? ''}>
      {preferredStoreCode && (
        <p data-testid="stock-default-my-store">stock availability defaults to my store</p>
      )}
      <StockAvailabilityList stores={orderedStores} preferredStoreCode={preferredStoreCode} />
    </div>
  );
}
