import { useState } from 'react';
import { useStockAdminOptions } from './useStockAdminOptions';
import { useStockAdminStock } from './useStockAdminStock';

export function useStockAdminFormState(initialSku?: string, initialStore?: string) {
  const [productSku, setProductSku] = useState(initialSku ?? '');
  const [storeCode, setStoreCode] = useState(initialStore ?? '');
  const [successMessage, setSuccessMessage] = useState('');
  const { stores, products } = useStockAdminOptions();
  const stockState = useStockAdminStock(productSku, storeCode);

  return {
    stores,
    products,
    productSku,
    storeCode,
    successMessage,
    setProductSku,
    setStoreCode,
    setSuccessMessage,
    ...stockState,
  };
}

export type StockAdminFormState = ReturnType<typeof useStockAdminFormState>;
