import type { CustomerReview } from '../shared/CustomerReview';
import type { AggregateStarRatingSnapshot } from '../shared/AggregateStarRating';

export type ReviewSort = 'newest' | 'oldest' | 'highest' | 'lowest';

export interface ReviewRepository {
  insert(review: CustomerReview): Promise<void>;
  update(review: CustomerReview): Promise<void>;
  findById(reviewId: string): Promise<CustomerReview | null>;
  findByProduct(
    sku: string,
    sort: ReviewSort,
    page: number,
    pageSize: number,
  ): Promise<{ reviews: CustomerReview[]; total: number }>;
  saveAggregate(sku: string, aggregate: AggregateStarRatingSnapshot): Promise<void>;
  getAggregate(sku: string): Promise<AggregateStarRatingSnapshot | null>;
}
