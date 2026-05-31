import React from 'react';
import type { ProductSummaryDTO } from './product-catalog.api';
import { GuideCrossLinks } from '../../content/client/GuideCrossLinks';
import { CategoryFilterSidebar } from './ProductCatalogGridParts';
import { ProductCatalogMainSection } from './ProductCatalogMainSection';
import { catalogGridStyle } from './productCatalogUiStyles';

interface ProductCatalogGridLayoutProps {
  categories: string[];
  category: string;
  products: ProductSummaryDTO[];
  loading: boolean;
  onCategoryChange: (category: string) => void;
}

export function ProductCatalogGridLayout({
  categories,
  category,
  products,
  loading,
  onCategoryChange,
}: ProductCatalogGridLayoutProps) {
  return (
    <div data-testid="product-catalog" style={catalogGridStyle}>
      <div>
        <CategoryFilterSidebar categories={categories} category={category} onCategoryChange={onCategoryChange} />
        <GuideCrossLinks speciesOrCategory={category} testId="product-catalog-guide-cross-links" />
      </div>
      <ProductCatalogMainSection products={products} loading={loading} />
    </div>
  );
}
