import React from 'react';
import { Link } from 'react-router-dom';
import type { ProductDetailDTO } from './product-catalog.api';
import { AggregateStarRatingDisplay, type AggregateStarRatingSnapshot } from './AggregateStarRating';
import { ProductImageGalleryNav } from './ProductImageGalleryNav';
import { ProductImageMainDisplay } from './ProductImageMainDisplay';
import { ProductImageThumbnails } from './ProductImageThumbnails';
import {
  productDescriptionSectionStyle,
  productDetailBreadcrumbStyle,
  productDetailHeaderStyle,
  productDetailMetaStyle,
  productDetailTitleStyle,
  productDimensionsStyle,
  productGallerySectionStyle,
} from './productCatalogUiStyles';

export function ProductDetailHeader({
  product,
  aggregate,
}: {
  product: ProductDetailDTO;
  aggregate?: AggregateStarRatingSnapshot | null;
}) {
  const categoryName = product.category?.name ?? '';
  return (
    <>
      <nav aria-label="breadcrumb" style={productDetailBreadcrumbStyle}>
        <Link to="/product-catalog">product catalog</Link>
        <span aria-hidden> › </span>
        <span aria-current="page">{product.name}</span>
      </nav>
      <header style={productDetailHeaderStyle}>
        <h1 style={productDetailTitleStyle}>{product.name}</h1>
        <p style={productDetailMetaStyle}>
          category <span data-testid="product-category">{categoryName}</span> · {product.price}
        </p>
        <AggregateStarRatingDisplay aggregate={aggregate ?? null} />
      </header>
    </>
  );
}

interface ProductImageGalleryProps {
  images: ProductDetailDTO['images'];
  imageIndex: number;
  onSelectImage: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function ProductImageGallery(props: ProductImageGalleryProps) {
  const currentImage = props.images[props.imageIndex];
  return (
    <section aria-label="image gallery" style={productGallerySectionStyle}>
      <ProductImageThumbnails images={props.images} imageIndex={props.imageIndex} onSelectImage={props.onSelectImage} />
      {currentImage && <ProductImageMainDisplay image={currentImage} />}
      <ProductImageGalleryNav
        imageIndex={props.imageIndex}
        imageCount={props.images.length}
        onPrevious={props.onPrevious}
        onNext={props.onNext}
      />
    </section>
  );
}

export function ProductDescription({ product }: { product: ProductDetailDTO }) {
  return (
    <section aria-label="description" style={productDescriptionSectionStyle}>
      <p>{product.description}</p>
      <div data-testid="product-dimensions" style={productDimensionsStyle}>
        {product.weight && <span>weight {product.weight}</span>}
        {product.dimensions?.length && <span>length {product.dimensions.length}</span>}
        {product.dimensions?.width && <span>width {product.dimensions.width}</span>}
        {product.dimensions?.height && <span>height {product.dimensions.height}</span>}
      </div>
    </section>
  );
}
