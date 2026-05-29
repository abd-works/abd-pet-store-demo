import React from 'react';
import { createStockAdminCancelHandler, createStockAdminSubmitHandler } from './stockAdminFormHandlers';
import { StockAdminFormView } from './StockAdminFormView';
import { useStockAdminFormState } from './useStockAdminFormState';

interface StockAdminFormProps {
  productSku?: string;
  storeCode?: string;
}

export function StockAdminForm({ productSku: initialSku, storeCode: initialStore }: StockAdminFormProps) {
  const form = useStockAdminFormState(initialSku, initialStore);

  return (
    <StockAdminFormView
      form={form}
      onSubmit={createStockAdminSubmitHandler(form)}
      onCancel={createStockAdminCancelHandler(form)}
    />
  );
}
