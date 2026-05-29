import React from 'react';
import type { ProductSummaryDTO } from './product-catalog.api';
import { ProductGridRow } from './ProductCatalogGridRows';

export { CategoryFilterSidebar } from './CategoryFilterSidebar';

export function ProductGridList({ products }: { products: ProductSummaryDTO[] }) {
  return (
    <ul role="list" aria-label="product grid" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {products.map((product) => (
        <ProductGridRow key={product.sku} product={product} />
      ))}
    </ul>
  );
}
