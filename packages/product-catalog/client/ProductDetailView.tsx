import React from 'react';
import { ProductDetailContent } from './ProductDetailContent';
import { productDetailLoadingStyle } from './productCatalogUiStyles';
import { useProductDetail } from './useProductDetail';

interface ProductDetailViewProps {
  sku: string;
}

export function ProductDetailView({ sku }: ProductDetailViewProps) {
  const { product, imageIndex, setImageIndex, loading } = useProductDetail(sku);

  if (loading) return <p style={productDetailLoadingStyle}>Loading product...</p>;
  if (!product) return null;

  return (
    <ProductDetailContent product={product} imageIndex={imageIndex} setImageIndex={setImageIndex} />
  );
}
