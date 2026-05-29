import { useEffect, useState } from 'react';
import { fetchStockAvailability } from './product-catalog.api';

export function useProductPurchaseStock(productSku: string) {
  const [maxAvailable, setMaxAvailable] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchStockAvailability(productSku)
      .then((rows) => {
        const total = rows.reduce((sum, row) => {
          const match = row.stock_label.match(/(\d+)/);
          return sum + (match ? Number(match[1]) : 0);
        }, 0);
        setMaxAvailable(total);
      })
      .catch(() => setMaxAvailable(0))
      .finally(() => setLoading(false));
  }, [productSku]);

  return { maxAvailable, loading, outOfStock: maxAvailable === 0 };
}
