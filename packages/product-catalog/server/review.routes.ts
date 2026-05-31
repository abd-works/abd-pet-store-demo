import { Router } from 'express';
import type { ReviewController } from './review.controller';

export function createReviewRouter(controller: ReviewController): Router {
  const router = Router();
  router.get('/api/products/:sku/reviews/eligibility', controller.reviewEligibility);
  router.get('/api/products/:sku/reviews', controller.listReviews);
  router.post('/api/products/:sku/reviews', controller.submitReview);
  router.post('/api/products/:sku/reviews/:reviewId/photos', controller.uploadPhoto);
  return router;
}
