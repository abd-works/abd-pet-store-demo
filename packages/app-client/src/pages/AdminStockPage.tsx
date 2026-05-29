import React from 'react';
import { StockAdminForm } from '../../../product-catalog/client/StockAdminForm';
import { Increment1Page } from '../components/Increment1Page';

export function AdminStockPage() {
  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#fafafa' }}>
      <main style={{ maxWidth: 560, margin: '0 auto', padding: '24px 16px' }}>
        <h1 style={{ fontSize: 22, marginBottom: 16 }}>admin dashboard — stock levels</h1>
        <div
          style={{
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: 4,
            padding: 16,
          }}
        >
          <StockAdminForm />
        </div>
      </main>
    </div>
  );
}
