import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ReviewForm } from './ReviewForm';
import { ReviewList, type ReviewListItem } from './ReviewList';
import { ReviewPhotoLightbox } from './ReviewPhotoLightbox';
import type { CustomerReviewSnapshot } from '../shared/CustomerReview';
import type { AggregateStarRatingDTO } from './reviews.api';
import type { ReviewSort } from './reviews.api';
import type { ReviewSessionState } from './useProductReviews';

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export interface ProductReviewsSectionProps {
  sku: string;
  session: ReviewSessionState;
  reviews: CustomerReviewSnapshot[];
  aggregate: AggregateStarRatingDTO | null;
  sort: ReviewSort;
  onSortChange: (sort: ReviewSort) => void;
  canSubmit: boolean;
  eligibilityLoaded: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onSubmitReview: (starRating: number, body: string) => Promise<CustomerReviewSnapshot>;
  onAttachPhoto: (reviewId: string, file: File) => Promise<void>;
}

export function ProductReviewsSection({
  sku,
  session,
  reviews,
  aggregate,
  sort,
  onSortChange,
  canSubmit,
  eligibilityLoaded,
  hasMore,
  onLoadMore,
  onSubmitReview,
  onAttachPhoto,
}: ProductReviewsSectionProps) {
  const [starRating, setStarRating] = useState<number | null>(null);
  const [body, setBody] = useState('');
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [pendingPhotoFile, setPendingPhotoFile] = useState<File | null>(null);
  const [lightboxKey, setLightboxKey] = useState<string | null>(null);

  const listItems: ReviewListItem[] = reviews.map((review) => ({
    reviewId: review.reviewId,
    starRating: review.starRating,
    body: review.body,
    photos: review.photos.map((photo) => ({
      storageKey: photo.storageKey,
      originalFilename: photo.originalFilename,
    })),
    createdAt: review.createdAt,
  }));

  const emptyPrompt =
    aggregate && aggregate.reviewCount > 0
      ? null
      : 'Be the first to review this product!';

  const guestPrompt = !session.isLoggedIn
    ? (
        <>
          Log in or register to leave a review{' '}
          <Link to={`/login?returnTo=${encodeURIComponent(`/product-catalog/${sku}`)}`}>Log In</Link>{' '}
          <Link to={`/register?returnTo=${encodeURIComponent(`/product-catalog/${sku}`)}`}>Register</Link>
        </>
      )
    : null;

  const purchasePrompt =
    session.isLoggedIn && eligibilityLoaded && !canSubmit
      ? 'Purchase this product to leave a review'
      : null;

  const validatePhotoFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.has(file.type)) {
      return 'Supported formats: JPEG, PNG, WebP';
    }
    if (file.size > MAX_PHOTO_BYTES) {
      return 'Image must be under 5 MB';
    }
    return null;
  };

  const handleSubmit = async () => {
    if (starRating === null) return;
    const created = await onSubmitReview(starRating, body);
    if (pendingPhotoFile) {
      const validationError = validatePhotoFile(pendingPhotoFile);
      if (validationError) {
        setPhotoError(validationError);
        return;
      }
      try {
        await onAttachPhoto(created.reviewId, pendingPhotoFile);
        setPendingPhotoFile(null);
      } catch (error) {
        setPhotoError(error instanceof Error ? error.message : 'Photo upload failed');
        return;
      }
    }
    setStarRating(null);
    setBody('');
    setPhotoError(null);
  };

  const handlePhotoSelect = (file: File) => {
    const validationError = validatePhotoFile(file);
    if (validationError) {
      setPhotoError(validationError);
      return;
    }
    setPhotoError(null);
    setPendingPhotoFile(file);
  };

  return (
    <section aria-label="customer reviews" data-testid="product-reviews-section" style={{ marginTop: 32 }}>
      <h2 style={{ fontSize: 18, marginBottom: 16 }}>Customer Reviews</h2>
      <ReviewList
        reviews={listItems}
        sort={sort}
        onSortChange={onSortChange}
        emptyPrompt={emptyPrompt}
        onPhotoSelect={(storageKey) => setLightboxKey(storageKey)}
      />
      {hasMore && (
        <button type="button" data-testid="load-more-reviews" onClick={onLoadMore}>
          Load More Reviews
        </button>
      )}
      <ReviewForm
        canSubmit={canSubmit && session.isVerified}
        guestPrompt={guestPrompt}
        purchasePrompt={purchasePrompt}
        values={{ starRating, body }}
        photoError={photoError}
        onStarRatingChange={setStarRating}
        onBodyChange={setBody}
        onSubmit={() => void handleSubmit()}
        onPhotoUpload={canSubmit ? handlePhotoSelect : undefined}
      />
      <ReviewPhotoLightbox
        isOpen={lightboxKey !== null}
        imageUrl={lightboxKey ? `/api/review-photos/${lightboxKey}` : null}
        altText="Review photo"
        onClose={() => setLightboxKey(null)}
      />
    </section>
  );
}
