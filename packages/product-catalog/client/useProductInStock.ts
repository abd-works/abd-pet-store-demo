import { useEffect, useState } from 'react';
import { fetchStockAvailability } from './product-catalog.api';

export function useProductInStock(sku: string): { inStock: boolean; loading: boolean } {
  const [inStock, setInStock] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void fetchStockAvailability(sku)
      .then((rows) => {
        const anyInStock = rows.some((row) => row.stock_label !== 'Out of Stock');
        if (!cancelled) setInStock(anyInStock);
      })
      .catch(() => {
        if (!cancelled) setInStock(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [sku]);

  return { inStock, loading };
}
