import React from 'react';
import { ProductDetailContent } from './ProductDetailContent';
import { productDetailLoadingStyle } from './productCatalogUiStyles';
import { useProductDetail } from './useProductDetail';
import type { ReviewSessionState } from './useProductReviews';

interface ProductDetailViewProps {
  sku: string;
  reviewSession?: ReviewSessionState;
}

export function ProductDetailView({ sku, reviewSession }: ProductDetailViewProps) {
  const { product, imageIndex, setImageIndex, loading } = useProductDetail(sku);
  const session = reviewSession ?? { isLoggedIn: false, isVerified: false };

  if (loading) return <p style={productDetailLoadingStyle}>Loading product...</p>;
  if (!product) return null;

  return (
    <ProductDetailContent
      product={product}
      imageIndex={imageIndex}
      setImageIndex={setImageIndex}
      reviewSession={session}
    />
  );
}
