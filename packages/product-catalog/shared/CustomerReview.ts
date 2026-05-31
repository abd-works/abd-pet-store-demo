import { StarRating } from './StarRating';
import type { ReviewPhotoSnapshot } from './ReviewPhoto';
import { ReviewPhoto } from './ReviewPhoto';

function newReviewId(): string {
  return globalThis.crypto.randomUUID();
}

export interface CustomerReviewSnapshot {
  reviewId: string;
  authorId: string;
  productSku: string;
  starRating: number;
  body: string | null;
  photos: ReviewPhotoSnapshot[];
  createdAt: string;
}

export interface CreateReviewInput {
  authorId: string;
  productSku: string;
  starRating: number;
  body?: string | null;
}

/** << Entity >> — verified purchaser opinion attached to a product. */
export class CustomerReview {
  readonly reviewId: string;
  readonly authorId: string;
  readonly productSku: string;
  readonly starRating: StarRating;
  readonly body: string | null;
  readonly photos: ReviewPhoto[];
  readonly createdAt: Date;

  private constructor(params: {
    reviewId: string;
    authorId: string;
    productSku: string;
    starRating: StarRating;
    body: string | null;
    photos: ReviewPhoto[];
    createdAt: Date;
  }) {
    this.reviewId = params.reviewId;
    this.authorId = params.authorId;
    this.productSku = params.productSku;
    this.starRating = params.starRating;
    this.body = params.body;
    this.photos = params.photos;
    this.createdAt = params.createdAt;
  }

  static create(input: CreateReviewInput, reviewId = newReviewId()): CustomerReview {
    return new CustomerReview({
      reviewId,
      authorId: input.authorId,
      productSku: input.productSku,
      starRating: StarRating.of(input.starRating),
      body: input.body?.trim() ? input.body.trim() : null,
      photos: [],
      createdAt: new Date(),
    });
  }

  attachPhoto(photo: ReviewPhoto): CustomerReview {
    return new CustomerReview({
      reviewId: this.reviewId,
      authorId: this.authorId,
      productSku: this.productSku,
      starRating: this.starRating,
      body: this.body,
      photos: [...this.photos, photo],
      createdAt: this.createdAt,
    });
  }

  toSnapshot(): CustomerReviewSnapshot {
    return {
      reviewId: this.reviewId,
      authorId: this.authorId,
      productSku: this.productSku,
      starRating: this.starRating.value,
      body: this.body,
      photos: this.photos.map((photo) => ({
        storageKey: photo.storageKey,
        originalFilename: photo.originalFilename,
        contentType: photo.contentType,
        sizeBytes: photo.sizeBytes,
      })),
      createdAt: this.createdAt.toISOString(),
    };
  }
}
