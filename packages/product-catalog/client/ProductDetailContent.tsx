import React from 'react';
import type { ProductDetailDTO } from './product-catalog.api';
import { ProductDescription, ProductDetailHeader, ProductImageGallery } from './ProductDetailViewParts';
import { ProductReviewsSection } from './ProductReviewsSection';
import type { ReviewSessionState } from './useProductReviews';
import { useProductReviews } from './useProductReviews';

interface ProductDetailContentProps {
  product: ProductDetailDTO;
  imageIndex: number;
  setImageIndex: (index: number) => void;
  reviewSession: ReviewSessionState;
}

export function ProductDetailContent({
  product,
  imageIndex,
  setImageIndex,
  reviewSession,
}: ProductDetailContentProps) {
  const reviewsState = useProductReviews(product.sku, reviewSession);

  return (
    <div data-testid="product-detail">
      <ProductDetailHeader product={product} aggregate={reviewsState.aggregate} />
      {product.images.length > 0 && (
        <ProductImageGallery
          images={product.images}
          imageIndex={imageIndex}
          onSelectImage={setImageIndex}
          onPrevious={() => setImageIndex((index) => Math.max(0, index - 1))}
          onNext={() => setImageIndex((index) => Math.min(product.images.length - 1, index + 1))}
        />
      )}
      <ProductDescription product={product} />
      <ProductReviewsSection
        sku={product.sku}
        session={reviewSession}
        reviews={reviewsState.reviews}
        aggregate={reviewsState.aggregate}
        sort={reviewsState.sort}
        onSortChange={reviewsState.setSort}
        canSubmit={reviewsState.canSubmit}
        eligibilityLoaded={reviewsState.eligibilityLoaded}
        hasMore={reviewsState.hasMore}
        onLoadMore={reviewsState.loadMore}
        onSubmitReview={reviewsState.submitReview}
        onAttachPhoto={reviewsState.attachPhoto}
      />
    </div>
  );
}
