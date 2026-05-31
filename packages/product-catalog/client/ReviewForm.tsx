import React from 'react';

export interface ReviewFormValues {
  starRating: number | null;
  body: string;
}

export interface ReviewFormProps {
  canSubmit: boolean;
  purchasePrompt?: string | null;
  guestPrompt?: React.ReactNode;
  values: ReviewFormValues;
  photoError?: string | null;
  onStarRatingChange: (rating: number) => void;
  onBodyChange: (body: string) => void;
  onSubmit: () => void;
  onPhotoUpload?: (file: File) => void;
}

export function ReviewForm({
  canSubmit,
  purchasePrompt,
  guestPrompt,
  values,
  photoError,
  onStarRatingChange,
  onBodyChange,
  onSubmit,
  onPhotoUpload,
}: ReviewFormProps) {
  if (guestPrompt) {
    return <p data-testid="review-guest-prompt">{guestPrompt}</p>;
  }

  if (purchasePrompt) {
    return <p data-testid="review-purchase-prompt">{purchasePrompt}</p>;
  }

  return (
    <form
      data-testid="review-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <fieldset>
        <legend>Star rating</legend>
        {[1, 2, 3, 4, 5].map((rating) => (
          <label key={rating}>
            <input
              type="radio"
              name="starRating"
              value={rating}
              checked={values.starRating === rating}
              onChange={() => onStarRatingChange(rating)}
            />
            {rating}
          </label>
        ))}
      </fieldset>
      <label htmlFor="written-review">
        Written review
        <textarea
          id="written-review"
          data-testid="review-body"
          value={values.body}
          onChange={(event) => onBodyChange(event.target.value)}
        />
      </label>
      {onPhotoUpload && (
        <label htmlFor="review-photo-input">
          upload review photos
          <input
            id="review-photo-input"
            data-testid="review-photo-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            aria-describedby={photoError ? 'review-photo-error' : undefined}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onPhotoUpload(file);
            }}
          />
        </label>
      )}
      {photoError && (
        <p id="review-photo-error" role="alert" aria-live="assertive" data-testid="review-photo-error">
          {photoError}
        </p>
      )}
      <button type="submit" disabled={!canSubmit || values.starRating === null}>
        Submit Review
      </button>
    </form>
  );
}
