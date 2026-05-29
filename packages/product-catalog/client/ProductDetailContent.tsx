import React from 'react';
import type { ProductDetailDTO } from './product-catalog.api';
import { ProductDescription, ProductDetailHeader, ProductImageGallery } from './ProductDetailViewParts';

interface ProductDetailContentProps {
  product: ProductDetailDTO;
  imageIndex: number;
  setImageIndex: (index: number) => void;
}

export function ProductDetailContent({ product, imageIndex, setImageIndex }: ProductDetailContentProps) {
  return (
    <div data-testid="product-detail">
      <ProductDetailHeader product={product} />
      {product.images.length > 0 && (
        <ProductImageGallery
          images={product.images}
          imageIndex={imageIndex}
          onSelectImage={setImageIndex}
          onPrevious={() => setImageIndex((index) => Math.max(0, index - 1))}
          onNext={() => setImageIndex((index) => Math.min(product.images.length - 1, index + 1))}
        />
      )}
      <ProductDescription product={product} />
    </div>
  );
}
