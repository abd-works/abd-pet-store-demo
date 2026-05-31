import React from 'react';

export interface ReviewPhotoLightboxProps {
  isOpen: boolean;
  imageUrl: string | null;
  altText: string;
  onClose: () => void;
}

export function ReviewPhotoLightbox({
  isOpen,
  imageUrl,
  altText,
  onClose,
}: ReviewPhotoLightboxProps) {
  if (!isOpen || !imageUrl) return null;

  return (
    <div data-testid="review-photo-lightbox" role="dialog" aria-modal="true">
      <button type="button" onClick={onClose}>
        Close
      </button>
      <img src={imageUrl} alt={altText} />
    </div>
  );
}
