import type { CustomerReviewSnapshot } from './CustomerReview';

export interface AggregateStarRatingSnapshot {
  average: number;
  reviewCount: number;
}

/** << ValueObject >> — derived average of star ratings; empty when no reviews exist. */
export class AggregateStarRating {
  readonly average: number;
  readonly reviewCount: number;

  private constructor(average: number, reviewCount: number) {
    this.average = average;
    this.reviewCount = reviewCount;
  }

  static fromReviews(reviews: CustomerReviewSnapshot[]): AggregateStarRating {
    if (reviews.length === 0) {
      return new AggregateStarRating(0, 0);
    }
    const total = reviews.reduce((sum, review) => sum + review.starRating, 0);
    return new AggregateStarRating(total / reviews.length, reviews.length);
  }

  isEmpty(): boolean {
    return this.reviewCount === 0;
  }

  toSnapshot(): AggregateStarRatingSnapshot {
    return { average: this.average, reviewCount: this.reviewCount };
  }
}
