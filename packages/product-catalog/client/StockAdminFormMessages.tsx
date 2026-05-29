import React from 'react';
import { stockAdminErrorStyle, stockAdminSuccessStyle } from './stockAdminFormStyles';

interface StockAdminFormMessagesProps {
  errorMessage: string;
  successMessage: string;
}

export function StockAdminFormMessages({ errorMessage, successMessage }: StockAdminFormMessagesProps) {
  return (
    <>
      {errorMessage && (
        <p id="stock-validation" role="alert" style={stockAdminErrorStyle}>
          validation feedback: {errorMessage}
        </p>
      )}
      {successMessage && <p style={stockAdminSuccessStyle}>{successMessage}</p>}
    </>
  );
}
