import React from 'react';
import { productGalleryNavStyle } from './productCatalogUiStyles';

interface GalleryNavButtonProps {
  label: string;
  disabled: boolean;
  onClick: () => void;
}

function GalleryNavButton({ label, disabled, onClick }: GalleryNavButtonProps) {
  return (
    <button type="button" aria-label={label} disabled={disabled} onClick={onClick}>
      {label}
    </button>
  );
}

interface ProductImageGalleryNavProps {
  imageIndex: number;
  imageCount: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function ProductImageGalleryNav({
  imageIndex,
  imageCount,
  onPrevious,
  onNext,
}: ProductImageGalleryNavProps) {
  if (imageCount <= 1) return null;

  return (
    <div data-testid="image-gallery-nav" style={productGalleryNavStyle}>
      <GalleryNavButton label="previous image" disabled={imageIndex === 0} onClick={onPrevious} />
      <GalleryNavButton label="next image" disabled={imageIndex >= imageCount - 1} onClick={onNext} />
    </div>
  );
}
