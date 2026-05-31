import type { OrderRepository } from '../../order/server/order.repository';
import type { CustomerAccountRepository } from '../../customer-account/server/customer-account.repository';
import type { SessionService } from '../../customer-account/server/session.service';
import type { CatalogProductBrowse } from './catalog-product-browse';
import { InMemoryReviewRepository } from './review.in-memory-repository';
import { OrderPurchaseVerificationClient } from './purchase-verification.client';
import { ReviewPhotoStorage } from './review-photo.storage';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { createReviewRouter } from './review.routes';

export interface ReviewModuleDeps {
  orderRepository: OrderRepository;
  accounts: CustomerAccountRepository;
  sessionService: SessionService;
  catalogBrowse: CatalogProductBrowse;
}

let sharedReviewRepository: InMemoryReviewRepository | null = null;
let sharedPhotoStorage: ReviewPhotoStorage | null = null;

export function getSharedReviewRepository(): InMemoryReviewRepository {
  if (!sharedReviewRepository) {
    sharedReviewRepository = new InMemoryReviewRepository();
  }
  return sharedReviewRepository;
}

export function getSharedReviewPhotoStorage(): ReviewPhotoStorage {
  if (!sharedPhotoStorage) {
    sharedPhotoStorage = new ReviewPhotoStorage();
  }
  return sharedPhotoStorage;
}

export function resetReviewModuleForTests(): void {
  getSharedReviewRepository().reset();
  getSharedReviewPhotoStorage().reset();
}

export function createReviewModule(deps: ReviewModuleDeps) {
  const reviews = getSharedReviewRepository();
  const photoStorage = getSharedReviewPhotoStorage();
  const purchaseVerification = new OrderPurchaseVerificationClient(deps.accounts, deps.orderRepository);
  const reviewService = new ReviewService(
    reviews,
    purchaseVerification,
    deps.catalogBrowse,
    photoStorage,
  );
  const reviewController = new ReviewController(reviewService, deps.sessionService);
  return {
    reviewService,
    reviewRouter: createReviewRouter(reviewController),
    reviewRepository: reviews,
  };
}
