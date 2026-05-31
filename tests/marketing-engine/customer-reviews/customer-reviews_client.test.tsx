/**
 * Customer reviews — client tests (Increment 8 Sprint 1, engineering interface-design)
 */
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  ReviewForm,
  ReviewList,
  AggregateStarRatingDisplay,
} from '@pawplace/product-catalog-client';

describe('Submit Written Review with Star Rating', () => {
  it('AC 3: non-purchaser sees purchase prompt', () => {
    render(
      <ReviewForm
        canSubmit={false}
        purchasePrompt="Purchase this product to leave a review"
        values={{ starRating: null, body: '' }}
        onStarRatingChange={vi.fn()}
        onBodyChange={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );
    expect(screen.getByTestId('review-purchase-prompt')).toHaveTextContent(
      'Purchase this product to leave a review',
    );
    expect(screen.queryByTestId('review-form')).not.toBeInTheDocument();
  });

  it('AC 4: guest sees login prompt without navigation', () => {
    render(
      <ReviewForm
        canSubmit={false}
        guestPrompt={
          <>
            Log in or register to leave a review{' '}
            <a href="/login">Log In</a>{' '}
            <a href="/register">Register</a>
          </>
        }
        values={{ starRating: null, body: '' }}
        onStarRatingChange={vi.fn()}
        onBodyChange={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );
    expect(screen.getByTestId('review-guest-prompt')).toHaveTextContent('Log in or register');
    expect(screen.getByRole('link', { name: 'Log In' })).toBeInTheDocument();
  });

  it('AC 1: verified purchaser sees star rating and optional written review', () => {
    render(
      <ReviewForm
        canSubmit
        values={{ starRating: 4, body: '' }}
        onStarRatingChange={vi.fn()}
        onBodyChange={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );
    expect(screen.getByRole('group', { name: /star rating/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/written review/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit Review' })).toBeInTheDocument();
  });
});

describe('Submit Photo Review', () => {
  it('AC 3: invalid format shows validation error with alert role', () => {
    const onPhoto = vi.fn();
    render(
      <ReviewForm
        canSubmit
        values={{ starRating: 5, body: 'Nice' }}
        photoError="Supported formats: JPEG, PNG, WebP"
        onStarRatingChange={vi.fn()}
        onBodyChange={vi.fn()}
        onSubmit={vi.fn()}
        onPhotoUpload={onPhoto}
      />,
    );
    expect(screen.getByTestId('review-photo-error')).toHaveAttribute('role', 'alert');
    expect(screen.getByLabelText(/upload review photos/i)).toBeInTheDocument();
  });
});

describe('Read Customer Reviews', () => {
  it('AC 2: zero reviews shows first-review prompt', () => {
    render(
      <ReviewList
        reviews={[]}
        sort="newest"
        onSortChange={vi.fn()}
        emptyPrompt="Be the first to review this product!"
      />,
    );
    expect(screen.getByTestId('review-empty-prompt')).toHaveTextContent(
      'Be the first to review this product!',
    );
  });

  it('AC 3: sort controls use newest, oldest, highest, lowest labels', () => {
    render(<ReviewList reviews={[]} sort="newest" onSortChange={vi.fn()} />);
    expect(screen.getByRole('tab', { name: 'Newest' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Oldest' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Highest Rating' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Lowest Rating' })).toBeInTheDocument();
  });

  it('AC 1: aggregate hidden when empty snapshot', () => {
    const { container } = render(<AggregateStarRatingDisplay aggregate={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('AC 4: photo thumbnail opens via callback', () => {
    const onPhotoSelect = vi.fn();
    render(
      <ReviewList
        reviews={[
          {
            reviewId: 'r1',
            starRating: 5,
            body: 'Great',
            photos: [{ storageKey: 'photo-1', originalFilename: 'puppy.jpg' }],
            createdAt: '2026-05-30T00:00:00Z',
          },
        ]}
        sort="newest"
        onSortChange={vi.fn()}
        onPhotoSelect={onPhotoSelect}
      />,
    );
    fireEvent.click(screen.getByTestId('review-photo-photo-1'));
    expect(onPhotoSelect).toHaveBeenCalledWith('photo-1');
  });
});
