import { useEffect, useState } from 'react';
import type { StockDetailDTO } from './product-catalog.api';
import { refreshStockAdminDetail } from './refreshStockAdminDetail';

export function useStockAdminStock(productSku: string, storeCode: string) {
  const [stock, setStock] = useState<StockDetailDTO | null>(null);
  const [inputQty, setInputQty] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void refreshStockAdminDetail(productSku, storeCode, {
      setStock,
      setInputQty,
      setErrorMessage,
      setLoading,
    });
  }, [productSku, storeCode]);

  return { stock, inputQty, setInputQty, errorMessage, setErrorMessage, loading, setStock };
}
