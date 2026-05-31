import { performFetch } from '../../shared/http-io';
import { assertResponseOk } from '../../shared/http-client';
import type { CustomerReviewSnapshot } from '../shared/CustomerReview';

export interface AggregateStarRatingDTO {
  average: number;
  reviewCount: number;
}

export interface ReviewListResponse {
  reviews: CustomerReviewSnapshot[];
  total: number;
  page: number;
  pageSize: number;
  aggregateStarRating: AggregateStarRatingDTO | null;
}

export interface ReviewEligibilityResponse {
  canSubmit: boolean;
}

export type ReviewSort = 'newest' | 'oldest' | 'highest' | 'lowest';

export async function fetchProductReviews(
  sku: string,
  sort: ReviewSort = 'newest',
  page = 1,
  pageSize = 10,
): Promise<ReviewListResponse> {
  const params = new URLSearchParams({
    sort,
    page: String(page),
    pageSize: String(pageSize),
  });
  const response = await performFetch(`/api/products/${encodeURIComponent(sku)}/reviews?${params}`);
  assertResponseOk(response, 'reviews');
  return response.json() as Promise<ReviewListResponse>;
}

export async function fetchReviewEligibility(sku: string): Promise<ReviewEligibilityResponse> {
  const response = await performFetch(`/api/products/${encodeURIComponent(sku)}/reviews/eligibility`);
  assertResponseOk(response, 'review eligibility');
  return response.json() as Promise<ReviewEligibilityResponse>;
}

export async function submitProductReview(
  sku: string,
  body: { starRating: number; body?: string | null },
): Promise<CustomerReviewSnapshot> {
  const response = await performFetch(`/api/products/${encodeURIComponent(sku)}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    const error = new Error(payload.error ?? `Failed to submit review: ${response.status}`);
    (error as Error & { status: number }).status = response.status;
    throw error;
  }
  const payload = (await response.json()) as { review: CustomerReviewSnapshot };
  return payload.review;
}

export async function uploadReviewPhoto(
  sku: string,
  reviewId: string,
  photo: { originalFilename: string; contentType: string; sizeBytes: number; dataBase64: string },
): Promise<CustomerReviewSnapshot> {
  const response = await performFetch(
    `/api/products/${encodeURIComponent(sku)}/reviews/${encodeURIComponent(reviewId)}/photos`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(photo),
    },
  );
  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(payload.error ?? `Failed to upload photo: ${response.status}`);
  }
  const payload = (await response.json()) as { review: CustomerReviewSnapshot };
  return payload.review;
}
