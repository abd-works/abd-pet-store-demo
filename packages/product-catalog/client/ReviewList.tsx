import React from 'react';

export interface ReviewListItem {
  reviewId: string;
  starRating: number;
  body: string | null;
  photos: { storageKey: string; originalFilename: string }[];
  createdAt: string;
}

export interface ReviewListProps {
  reviews: ReviewListItem[];
  sort: 'newest' | 'oldest' | 'highest' | 'lowest';
  onSortChange: (sort: ReviewListProps['sort']) => void;
  onPhotoSelect?: (storageKey: string) => void;
  emptyPrompt?: string | null;
}

const SORT_TAB_LABELS: Record<ReviewListProps['sort'], string> = {
  newest: 'Newest',
  oldest: 'Oldest',
  highest: 'Highest Rating',
  lowest: 'Lowest Rating',
};

export function ReviewList({
  reviews,
  sort,
  onSortChange,
  onPhotoSelect,
  emptyPrompt,
}: ReviewListProps) {
  return (
    <section data-testid="review-list">
      <div role="tablist" aria-label="Sort reviews">
        {(['newest', 'oldest', 'highest', 'lowest'] as const).map((option) => (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={sort === option}
            onClick={() => onSortChange(option)}
          >
            {SORT_TAB_LABELS[option]}
          </button>
        ))}
      </div>
      {reviews.length === 0 && emptyPrompt && (
        <p data-testid="review-empty-prompt">{emptyPrompt}</p>
      )}
      <ul>
        {reviews.map((review) => (
          <li key={review.reviewId} data-testid={`review-item-${review.reviewId}`}>
            <span data-testid="review-star-rating">{review.starRating}</span>
            {review.body && <p>{review.body}</p>}
            {review.photos.map((photo) => (
              <button
                key={photo.storageKey}
                type="button"
                data-testid={`review-photo-${photo.storageKey}`}
                onClick={() => onPhotoSelect?.(photo.storageKey)}
              >
                {photo.originalFilename}
              </button>
            ))}
          </li>
        ))}
      </ul>
    </section>
  );
}
