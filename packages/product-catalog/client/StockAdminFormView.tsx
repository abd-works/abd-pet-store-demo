import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StockAdminHeader } from './StockAdminHeader';
import { StockAdminFormBody } from './StockAdminFormBody';
import {
  stockAdminDeepLinkButtonStyle,
  stockAdminDeepLinkStyle,
} from './stockAdminFormStyles';
import type { StockAdminFormState } from './useStockAdminFormState';

interface StockAdminDeepLinkProps {
  productSku: string;
  storeCode: string;
  onNavigate: (path: string) => void;
}

function StockAdminDeepLink({ productSku, storeCode, onNavigate }: StockAdminDeepLinkProps) {
  const path = `/admin/stock/${productSku}/${storeCode}`;
  return (
    <p style={stockAdminDeepLinkStyle}>
      Deep link:{' '}
      <button type="button" style={stockAdminDeepLinkButtonStyle} onClick={() => onNavigate(path)}>
        {path}
      </button>
    </p>
  );
}

interface StockAdminFormViewProps {
  form: StockAdminFormState;
  onSubmit: (event: React.FormEvent) => void;
  onCancel: () => void;
}

export function StockAdminFormView({ form, onSubmit, onCancel }: StockAdminFormViewProps) {
  const navigate = useNavigate();

  return (
    <div data-testid="admin-dashboard-stock-form">
      <StockAdminHeader />
      <StockAdminFormBody form={form} onSubmit={onSubmit} onCancel={onCancel} />
      {form.productSku && form.storeCode && (
        <StockAdminDeepLink
          productSku={form.productSku}
          storeCode={form.storeCode}
          onNavigate={navigate}
        />
      )}
    </div>
  );
}
