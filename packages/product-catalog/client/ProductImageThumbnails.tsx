import React from 'react';
import type { ProductDetailDTO } from './product-catalog.api';
import {
  productThumbnailButtonStyle,
  productThumbnailImageStyle,
} from './productCatalogUiStyles';

function ProductThumbnailImage({ image }: { image: ProductDetailDTO['images'][number] }) {
  return (
    <img
      src={image.imageFile}
      alt={image.altText}
      data-testid="product-image"
      width={80}
      height={60}
      style={productThumbnailImageStyle}
    />
  );
}

interface ProductImageThumbnailProps {
  image: ProductDetailDTO['images'][number];
  index: number;
  imageIndex: number;
  onSelectImage: (index: number) => void;
}

function ProductImageThumbnail({ image, index, imageIndex, onSelectImage }: ProductImageThumbnailProps) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={index === imageIndex}
      aria-label={image.altText}
      onClick={() => onSelectImage(index)}
      style={productThumbnailButtonStyle(index === imageIndex)}
    >
      <ProductThumbnailImage image={image} />
    </button>
  );
}

interface ProductImageThumbnailsProps {
  images: ProductDetailDTO['images'];
  imageIndex: number;
  onSelectImage: (index: number) => void;
}

export function ProductImageThumbnails({ images, imageIndex, onSelectImage }: ProductImageThumbnailsProps) {
  return (
    <div role="listbox" aria-label="product image thumbnails" style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
      {images.map((image, index) => (
        <ProductImageThumbnail
          key={image.displayOrder}
          image={image}
          index={index}
          imageIndex={imageIndex}
          onSelectImage={onSelectImage}
        />
      ))}
    </div>
  );
}
