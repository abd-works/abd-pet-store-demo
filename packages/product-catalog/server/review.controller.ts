import type { Request, Response } from 'express';
import { HttpStatus } from '../../shared/http-status';
import {
  createReviewSchema,
  reviewListQuerySchema,
  reviewPhotoSchema,
} from '../shared/review.schema';
import {
  NotPurchasedError,
  ProductNotFoundForReviewError,
  ReviewNotFoundError,
} from '../shared/review.errors';
import {
  UnsupportedReviewPhotoFormatError,
  ReviewPhotoTooLargeError,
} from '../shared/ReviewPhoto';
import type { ReviewService } from './review.service';
import type { SessionService } from '../../customer-account/server/session.service';
import {
  AuthenticationRequiredError,
  UnverifiedAccountError,
} from '../../customer-account/server/customer-account.errors';

export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly sessionService: SessionService,
  ) {}

  reviewEligibility = async (req: Request, res: Response): Promise<void> => {
    try {
      const principal = await this.sessionService.requireVerifiedPrincipal(req.session?.id);
      const canSubmit = await this.reviewService.canSubmitReview(principal.accountId, req.params.sku);
      res.status(HttpStatus.OK).json({ canSubmit });
    } catch (error) {
      if (error instanceof ProductNotFoundForReviewError) {
        res.status(HttpStatus.NOT_FOUND).json({ error: error.message });
        return;
      }
      if (error instanceof AuthenticationRequiredError || error instanceof UnverifiedAccountError) {
        res.status(HttpStatus.OK).json({ canSubmit: false });
        return;
      }
      throw error;
    }
  };

  listReviews = async (req: Request, res: Response): Promise<void> => {
    try {
      const query = reviewListQuerySchema.parse(req.query);
      const result = await this.reviewService.listReviews(req.params.sku, query);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      if (error instanceof ProductNotFoundForReviewError) {
        res.status(HttpStatus.NOT_FOUND).json({ error: error.message });
        return;
      }
      throw error;
    }
  };

  submitReview = async (req: Request, res: Response): Promise<void> => {
    const parsed = createReviewSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'Invalid review', details: parsed.error.flatten() });
      return;
    }

    try {
      const principal = await this.sessionService.requireVerifiedPrincipal(req.session?.id);
      const review = await this.reviewService.submitReview(
        principal.accountId,
        req.params.sku,
        parsed.data,
      );
      res.status(HttpStatus.CREATED).json({ review: review.toSnapshot() });
    } catch (error) {
      if (error instanceof NotPurchasedError) {
        res.status(HttpStatus.FORBIDDEN).json({ error: error.message, sku: error.sku });
        return;
      }
      if (error instanceof ProductNotFoundForReviewError) {
        res.status(HttpStatus.NOT_FOUND).json({ error: error.message });
        return;
      }
      this.handleAuthError(error, res);
    }
  };

  uploadPhoto = async (req: Request, res: Response): Promise<void> => {
    const parsed = reviewPhotoSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'Invalid photo upload', details: parsed.error.flatten() });
      return;
    }

    try {
      const principal = await this.sessionService.requireVerifiedPrincipal(req.session?.id);
      const review = await this.reviewService.attachPhoto(
        principal.accountId,
        req.params.sku,
        req.params.reviewId,
        parsed.data,
      );
      res.status(HttpStatus.CREATED).json({ review: review.toSnapshot() });
    } catch (error) {
      if (error instanceof UnsupportedReviewPhotoFormatError || error instanceof ReviewPhotoTooLargeError) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
        return;
      }
      if (error instanceof ReviewNotFoundError) {
        res.status(HttpStatus.NOT_FOUND).json({ error: error.message });
        return;
      }
      this.handleAuthError(error, res);
    }
  };

  private handleAuthError(error: unknown, res: Response): void {
    if (error instanceof AuthenticationRequiredError) {
      res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Authentication required' });
      return;
    }
    if (error instanceof UnverifiedAccountError) {
      res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Email verification required' });
      return;
    }
    throw error;
  }
}
