import React from 'react';
import { Link } from 'react-router-dom';
import { ProductSelect, StoreSelect } from './StockAdminSelectors';

interface StockAdminSelectorsProps {
  stores: Parameters<typeof StoreSelect>[0]['stores'];
  products: Parameters<typeof ProductSelect>[0]['products'];
  storeCode: string;
  productSku: string;
  onStoreChange: (code: string) => void;
  onProductChange: (sku: string) => void;
}

export function StockAdminSelectors({
  stores,
  products,
  storeCode,
  productSku,
  onStoreChange,
  onProductChange,
}: StockAdminSelectorsProps) {
  return (
    <>
      <StoreSelect stores={stores} storeCode={storeCode} onStoreChange={onStoreChange} />
      <ProductSelect products={products} productSku={productSku} onProductChange={onProductChange} />
    </>
  );
}

export { StockQuantityFields } from './StockQuantityFields';
export { stockAdminFormStyle } from './stockAdminFormStyles';
