import { CustomerReview } from '../shared/CustomerReview';
import { AggregateStarRating } from '../shared/AggregateStarRating';
import type { CreateReviewBody, ReviewPhotoBody, ReviewListQuery } from '../shared/review.schema';
import {
  NotPurchasedError,
  ProductNotFoundForReviewError,
  ReviewNotFoundError,
} from '../shared/review.errors';
import type { ReviewRepository } from './review.repository';
import type { PurchaseVerificationClient } from './purchase-verification.client';
import type { ReviewPhotoStorage } from './review-photo.storage';
import type { CatalogProductBrowse } from './catalog-product-browse';

export class ReviewService {
  constructor(
    private readonly reviews: ReviewRepository,
    private readonly purchaseVerification: PurchaseVerificationClient,
    private readonly catalogBrowse: CatalogProductBrowse,
    private readonly photoStorage: ReviewPhotoStorage,
  ) {}

  async submitReview(accountId: string, sku: string, input: CreateReviewBody): Promise<CustomerReview> {
    if (!this.catalogBrowse.getProductBySku(sku)) {
      throw new ProductNotFoundForReviewError(sku);
    }

    const purchased = await this.purchaseVerification.hasPurchased(accountId, sku);
    if (!purchased) throw new NotPurchasedError(sku);

    const review = CustomerReview.create({
      authorId: accountId,
      productSku: sku,
      starRating: input.starRating,
      body: input.body,
    });
    await this.reviews.insert(review);
    await this.recomputeAggregate(sku);
    return review;
  }

  async listReviews(sku: string, query: ReviewListQuery) {
    if (!this.catalogBrowse.getProductBySku(sku)) {
      throw new ProductNotFoundForReviewError(sku);
    }

    const { reviews, total } = await this.reviews.findByProduct(
      sku,
      query.sort,
      query.page,
      query.pageSize,
    );
    const aggregate = await this.reviews.getAggregate(sku);
    return {
      reviews: reviews.map((review) => review.toSnapshot()),
      total,
      page: query.page,
      pageSize: query.pageSize,
      aggregateStarRating: aggregate && aggregate.reviewCount > 0 ? aggregate : null,
    };
  }

  async attachPhoto(
    accountId: string,
    sku: string,
    reviewId: string,
    input: ReviewPhotoBody,
  ): Promise<CustomerReview> {
    const review = await this.reviews.findById(reviewId);
    if (!review || review.productSku !== sku || review.authorId !== accountId) {
      throw new ReviewNotFoundError(reviewId);
    }

    const photo = this.photoStorage.store(input);
    const updated = review.attachPhoto(photo);
    await this.reviews.update(updated);
    return updated;
  }

  async canSubmitReview(accountId: string, sku: string): Promise<boolean> {
    if (!this.catalogBrowse.getProductBySku(sku)) {
      throw new ProductNotFoundForReviewError(sku);
    }
    return this.purchaseVerification.hasPurchased(accountId, sku);
  }

  async recomputeAggregate(sku: string): Promise<AggregateStarRating> {
    const { reviews } = await this.reviews.findByProduct(sku, 'newest', 1, 10_000);
    const aggregate = AggregateStarRating.fromReviews(reviews.map((review) => review.toSnapshot()));
    await this.reviews.saveAggregate(sku, aggregate.toSnapshot());
    return aggregate;
  }
}
