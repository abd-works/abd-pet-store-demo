import React from 'react';
import { stockAdminHeaderStyle } from './stockAdminFormStyles';

export function StockAdminHeader() {
  return (
    <header aria-label="staff header" style={stockAdminHeaderStyle}>
      staff header — *store employee* · admin dashboard — stock levels
    </header>
  );
}
