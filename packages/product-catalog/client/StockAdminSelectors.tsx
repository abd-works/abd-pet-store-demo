import React from 'react';
import type { StoreResponse } from '../../store/client/store.api';
import { stockAdminSelectStyle } from './stockAdminFormStyles';

function StoreSelectOptions({ stores }: { stores: StoreResponse[] }) {
  return (
    <>
      <option value="">— select store —</option>
      {stores.map((store) => (
        <option key={store.storeCode} value={store.storeCode}>
          {store.storeName}
        </option>
      ))}
    </>
  );
}

interface StoreSelectProps {
  stores: StoreResponse[];
  storeCode: string;
  onStoreChange: (code: string) => void;
}

export function StoreSelect({ stores, storeCode, onStoreChange }: StoreSelectProps) {
  return (
    <label htmlFor="admin-store-select">
      store
      <select
        id="admin-store-select"
        aria-label="store"
        value={storeCode}
        onChange={(event) => onStoreChange(event.target.value)}
        style={stockAdminSelectStyle}
      >
        <StoreSelectOptions stores={stores} />
      </select>
    </label>
  );
}

function ProductSelectOptions({ products }: { products: { sku: string; name: string }[] }) {
  return (
    <>
      <option value="">— select product —</option>
      {products.map((product) => (
        <option key={product.sku} value={product.sku}>
          {product.name}
        </option>
      ))}
    </>
  );
}

interface ProductSelectProps {
  products: { sku: string; name: string }[];
  productSku: string;
  onProductChange: (sku: string) => void;
}

export function ProductSelect({ products, productSku, onProductChange }: ProductSelectProps) {
  return (
    <label htmlFor="admin-product-select">
      product
      <select
        id="admin-product-select"
        aria-label="product"
        value={productSku}
        onChange={(event) => onProductChange(event.target.value)}
        style={stockAdminSelectStyle}
      >
        <ProductSelectOptions products={products} />
      </select>
    </label>
  );
}
