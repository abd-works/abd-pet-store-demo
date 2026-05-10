import React from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { ProductDetailView } from '../../product-catalog/client/ProductDetailView';
import { StockAvailabilityDisplay } from '../../product-catalog/client/StockAvailabilityDisplay';
import { StockAdminForm } from '../../product-catalog/client/StockAdminForm';
import { StoreLocatorPage } from './pages/StoreLocatorPage';
import { HomePage } from './pages/HomePage';

function ProductPage() {
  const { sku } = useParams<{ sku: string }>();
  if (!sku) return null;
  return (
    <div>
      <ProductDetailView sku={sku} />
      <StockAvailabilityDisplay productSku={sku} />
    </div>
  );
}

function StockAdminPage() {
  const { productSku, storeCode } = useParams<{ productSku: string; storeCode: string }>();
  if (!productSku || !storeCode) return null;
  return <StockAdminForm productSku={productSku} storeCode={storeCode} />;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<HomePage />} />
              <Route path="/products/:sku" element={<ProductPage />} />
        <Route path="/store-locator" element={<StoreLocatorPage />} />
        <Route path="/admin/stock/:productSku/:storeCode" element={<StockAdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}
