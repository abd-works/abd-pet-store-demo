import { randomUUID } from 'node:crypto';
import { ReviewPhoto } from '../shared/ReviewPhoto';
import type { ReviewPhotoBody } from '../shared/review.schema';

export interface StoredReviewPhoto {
  storageKey: string;
  originalFilename: string;
  contentType: string;
  sizeBytes: number;
}

export class ReviewPhotoStorage {
  private readonly photos = new Map<string, StoredReviewPhoto>();

  store(input: ReviewPhotoBody): ReviewPhoto {
    const storageKey = `review-photo/${randomUUID()}`;
    const photo = ReviewPhoto.create({
      storageKey,
      originalFilename: input.originalFilename,
      contentType: input.contentType,
      sizeBytes: input.sizeBytes,
    });
    this.photos.set(storageKey, {
      storageKey,
      originalFilename: input.originalFilename,
      contentType: input.contentType,
      sizeBytes: input.sizeBytes,
    });
    return photo;
  }

  get(storageKey: string): StoredReviewPhoto | undefined {
    return this.photos.get(storageKey);
  }

  reset(): void {
    this.photos.clear();
  }
}
