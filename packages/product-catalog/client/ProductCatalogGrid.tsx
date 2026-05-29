import React, { useState } from 'react';
import { ProductCatalogGridLayout } from './ProductCatalogGridLayout';
import { useProductCatalogProducts } from './useProductCatalogProducts';
import { useProductCategories } from './useProductCategories';

export function ProductCatalogGrid() {
  const [category, setCategory] = useState('');
  const { products, loading } = useProductCatalogProducts(category);
  const categories = useProductCategories(products);

  return (
    <ProductCatalogGridLayout
      categories={categories}
      category={category}
      products={products}
      loading={loading}
      onCategoryChange={setCategory}
    />
  );
}
