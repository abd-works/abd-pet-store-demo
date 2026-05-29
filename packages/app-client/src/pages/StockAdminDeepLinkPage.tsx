import React from 'react';
import { useParams } from 'react-router-dom';
import { StockAdminForm } from '../../../product-catalog/client/StockAdminForm';

export function StockAdminDeepLinkPage() {
  const { productSku, storeCode } = useParams<{ productSku: string; storeCode: string }>();
  if (!productSku || !storeCode) return null;
  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#fafafa' }}>
      <main style={{ maxWidth: 560, margin: '0 auto', padding: '24px 16px' }}>
        <h1 style={{ fontSize: 22, marginBottom: 16 }}>admin dashboard — stock levels</h1>
        <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 4, padding: 16 }}>
          <StockAdminForm productSku={productSku} storeCode={storeCode} />
        </div>
      </main>
    </div>
  );
}
