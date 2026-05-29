import React from 'react';
import { ProductCatalogGrid } from '../../../product-catalog/client/ProductCatalogGrid';
import { Increment1Page } from '../components/Increment1Page';

export function ProductCatalogPage() {
  return (
    <Increment1Page title="product catalog">
      <ProductCatalogGrid />
    </Increment1Page>
  );
}
