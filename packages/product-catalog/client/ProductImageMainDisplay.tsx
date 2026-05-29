import React from 'react';
import type { ProductDetailDTO } from './product-catalog.api';
import { productGalleryMainImageStyle } from './productCatalogUiStyles';

export function ProductImageMainDisplay({ image }: { image: ProductDetailDTO['images'][number] }) {
  return (
    <img src={image.imageFile} alt={image.altText} style={productGalleryMainImageStyle} />
  );
}
