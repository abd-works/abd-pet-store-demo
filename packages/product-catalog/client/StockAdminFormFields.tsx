import React from 'react';
import {
  StockAdminSelectors,
  StockQuantityFields,
} from './StockAdminFormParts';
import { stockAdminLoadingStyle } from './stockAdminFormStyles';
import type { StockAdminFormState } from './useStockAdminFormState';

interface StockAdminStockSectionProps {
  form: StockAdminFormState;
}

function StockAdminStockSection({ form }: StockAdminStockSectionProps) {
  if (form.loading) return <p style={stockAdminLoadingStyle}>Loading stock...</p>;
  if (!form.stock) return null;

  return (
    <StockQuantityFields
      stock={form.stock}
      inputQty={form.inputQty}
      errorMessage={form.errorMessage}
      onQtyChange={form.setInputQty}
    />
  );
}

interface StockAdminFormFieldsProps {
  form: StockAdminFormState;
}

export function StockAdminFormFields({ form }: StockAdminFormFieldsProps) {
  return (
    <>
      <StockAdminSelectors
        stores={form.stores}
        products={form.products}
        storeCode={form.storeCode}
        productSku={form.productSku}
        onStoreChange={form.setStoreCode}
        onProductChange={form.setProductSku}
      />
      <StockAdminStockSection form={form} />
    </>
  );
}
