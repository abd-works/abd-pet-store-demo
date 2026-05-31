export class NotPurchasedError extends Error {
  constructor(readonly sku: string) {
    super(`Purchase required to review product ${sku}`);
    this.name = 'NotPurchasedError';
  }
}

export class ReviewNotFoundError extends Error {
  constructor(readonly reviewId: string) {
    super(`Review not found: ${reviewId}`);
    this.name = 'ReviewNotFoundError';
  }
}

export class ProductNotFoundForReviewError extends Error {
  constructor(readonly sku: string) {
    super(`Product not found: ${sku}`);
    this.name = 'ProductNotFoundForReviewError';
  }
}
