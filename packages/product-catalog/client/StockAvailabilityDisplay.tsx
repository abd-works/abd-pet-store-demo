import React, { useEffect, useState } from 'react';
import { fetchStockAvailability, type StoreStockDTO } from './product-catalog.api';
import { StockAvailabilityList } from './StockAvailabilityDisplayParts';

interface StockAvailabilityDisplayProps {
  productSku: string;
}

export function StockAvailabilityDisplay({ productSku }: StockAvailabilityDisplayProps) {
  const [stores, setStores] = useState<StoreStockDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchStockAvailability(productSku).then((rows) => {
      setStores(rows);
      setLoading(false);
    });
  }, [productSku]);

  if (loading) return <p style={{ color: '#888' }}>Loading stock availability...</p>;
  if (stores.length === 0) return <p>No stock availability data.</p>;

  return <StockAvailabilityList stores={stores} />;
}
