import React from 'react';
import { Link } from 'react-router-dom';
import { StockAdminFormFields } from './StockAdminFormFields';
import { StockAdminFormMessages } from './StockAdminFormMessages';
import { stockAdminFormStyle, stockAdminActionsStyle } from './stockAdminFormStyles';
import type { StockAdminFormState } from './useStockAdminFormState';

interface StockAdminFormBodyProps {
  form: StockAdminFormState;
  onSubmit: (event: React.FormEvent) => void;
  onCancel: () => void;
}

export function StockAdminFormBody({ form, onSubmit, onCancel }: StockAdminFormBodyProps) {
  return (
    <form onSubmit={onSubmit} aria-label="stock levels form">
      <div style={stockAdminFormStyle}>
        <StockAdminFormFields form={form} />
        <StockAdminFormMessages errorMessage={form.errorMessage} successMessage={form.successMessage} />
        <div style={stockAdminActionsStyle}>
          <button type="submit" disabled={!form.stock}>save</button>
          <button type="button" onClick={onCancel} disabled={!form.stock}>cancel</button>
          <Link to="/">back to home</Link>
        </div>
      </div>
    </form>
  );
}
