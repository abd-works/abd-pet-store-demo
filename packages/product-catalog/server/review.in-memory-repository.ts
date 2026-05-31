import { CustomerReview } from '../shared/CustomerReview';
import type { AggregateStarRatingSnapshot } from '../shared/AggregateStarRating';
import type { ReviewRepository, ReviewSort } from './review.repository';

function sortReviews(reviews: CustomerReview[], sort: ReviewSort): CustomerReview[] {
  const copy = [...reviews];
  switch (sort) {
    case 'oldest':
      return copy.sort((left, right) => left.createdAt.getTime() - right.createdAt.getTime());
    case 'highest':
      return copy.sort(
        (left, right) => right.starRating.value - left.starRating.value
          || right.createdAt.getTime() - left.createdAt.getTime(),
      );
    case 'lowest':
      return copy.sort(
        (left, right) => left.starRating.value - right.starRating.value
          || right.createdAt.getTime() - left.createdAt.getTime(),
      );
    case 'newest':
    default:
      return copy.sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime());
  }
}

export class InMemoryReviewRepository implements ReviewRepository {
  private readonly reviews = new Map<string, CustomerReview>();
  private readonly byProduct = new Map<string, Set<string>>();
  private readonly aggregates = new Map<string, AggregateStarRatingSnapshot>();

  async insert(review: CustomerReview): Promise<void> {
    this.reviews.set(review.reviewId, review);
    const ids = this.byProduct.get(review.productSku) ?? new Set<string>();
    ids.add(review.reviewId);
    this.byProduct.set(review.productSku, ids);
  }

  async update(review: CustomerReview): Promise<void> {
    if (!this.reviews.has(review.reviewId)) {
      throw new Error(`Review not found: ${review.reviewId}`);
    }
    this.reviews.set(review.reviewId, review);
  }

  async findById(reviewId: string): Promise<CustomerReview | null> {
    return this.reviews.get(reviewId) ?? null;
  }

  async findByProduct(
    sku: string,
    sort: ReviewSort,
    page: number,
    pageSize: number,
  ): Promise<{ reviews: CustomerReview[]; total: number }> {
    const ids = this.byProduct.get(sku) ?? new Set<string>();
    const reviews = sortReviews(
      [...ids].map((id) => this.reviews.get(id)).filter((review): review is CustomerReview => !!review),
      sort,
    );
    const start = (page - 1) * pageSize;
    return {
      reviews: reviews.slice(start, start + pageSize),
      total: reviews.length,
    };
  }

  async saveAggregate(sku: string, aggregate: AggregateStarRatingSnapshot): Promise<void> {
    this.aggregates.set(sku, aggregate);
  }

  async getAggregate(sku: string): Promise<AggregateStarRatingSnapshot | null> {
    return this.aggregates.get(sku) ?? null;
  }

  reset(): void {
    this.reviews.clear();
    this.byProduct.clear();
    this.aggregates.clear();
  }
}
