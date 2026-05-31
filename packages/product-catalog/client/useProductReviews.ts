import { useCallback, useEffect, useState } from 'react';
import type { CustomerReviewSnapshot } from '../shared/CustomerReview';
import {
  fetchProductReviews,
  fetchReviewEligibility,
  submitProductReview,
  uploadReviewPhoto,
  type AggregateStarRatingDTO,
  type ReviewSort,
} from './reviews.api';

export interface ReviewSessionState {
  isLoggedIn: boolean;
  isVerified: boolean;
}

export function useProductReviews(sku: string, session: ReviewSessionState) {
  const [reviews, setReviews] = useState<CustomerReviewSnapshot[]>([]);
  const [aggregate, setAggregate] = useState<AggregateStarRatingDTO | null>(null);
  const [sort, setSort] = useState<ReviewSort>('newest');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [canSubmit, setCanSubmit] = useState(false);
  const [eligibilityLoaded, setEligibilityLoaded] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchProductReviews(sku, sort, page, 10);
      setReviews((current) => (page === 1 ? result.reviews : [...current, ...result.reviews]));
      setTotal(result.total);
      setAggregate(result.aggregateStarRating);
    } finally {
      setLoading(false);
    }
  }, [sku, sort, page]);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    setPage(1);
  }, [sort]);

  useEffect(() => {
    if (!session.isLoggedIn || !session.isVerified) {
      setCanSubmit(false);
      setEligibilityLoaded(true);
      return;
    }
    setEligibilityLoaded(false);
    fetchReviewEligibility(sku)
      .then((result) => {
        setCanSubmit(result.canSubmit);
        setEligibilityLoaded(true);
      })
      .catch(() => {
        setCanSubmit(false);
        setEligibilityLoaded(true);
      });
  }, [sku, session.isLoggedIn, session.isVerified]);

  const submitReview = useCallback(
    async (starRating: number, body: string) => {
      const review = await submitProductReview(sku, { starRating, body: body.trim() || null });
      setPage(1);
      const result = await fetchProductReviews(sku, sort, 1, 10);
      setReviews(result.reviews);
      setTotal(result.total);
      setAggregate(result.aggregateStarRating);
      return review;
    },
    [sku, sort],
  );

  const attachPhoto = useCallback(
    async (reviewId: string, file: File) => {
      const dataBase64 = await fileToBase64(file);
      await uploadReviewPhoto(sku, reviewId, {
        originalFilename: file.name,
        contentType: file.type,
        sizeBytes: file.size,
        dataBase64,
      });
      await reload();
    },
    [sku, reload],
  );

  const loadMore = useCallback(() => {
    if (reviews.length < total) setPage((current) => current + 1);
  }, [reviews.length, total]);

  return {
    reviews,
    aggregate,
    sort,
    setSort,
    loading,
    canSubmit,
    eligibilityLoaded,
    submitReview,
    attachPhoto,
    loadMore,
    hasMore: reviews.length < total,
    reload,
  };
}

async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}
