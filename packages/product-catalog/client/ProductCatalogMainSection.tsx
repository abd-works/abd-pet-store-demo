import React from 'react';
import type { ProductSummaryDTO } from './product-catalog.api';
import { ProductGridList } from './ProductCatalogGridParts';
import { catalogLoadingStyle, catalogSectionStyle } from './productCatalogUiStyles';

interface ProductCatalogMainSectionProps {
  products: ProductSummaryDTO[];
  loading: boolean;
}

export function ProductCatalogMainSection({ products, loading }: ProductCatalogMainSectionProps) {
  return (
    <section style={catalogSectionStyle}>
      {loading ? (
        <p style={catalogLoadingStyle}>Loading products...</p>
      ) : (
        <ProductGridList products={products} />
      )}
    </section>
  );
}
