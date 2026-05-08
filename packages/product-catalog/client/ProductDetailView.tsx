import React, { useEffect, useState } from 'react';
import { fetchProductBySku, type ProductDetailDTO } from './product-catalog.api';

interface ProductDetailViewProps {
  sku: string;
}

export function ProductDetailView({ sku }: ProductDetailViewProps) {
  const [product, setProduct] = useState<ProductDetailDTO | null>(null);

  useEffect(() => {
    fetchProductBySku(sku).then(setProduct);
  }, [sku]);

  if (!product) return null;

  return (
    <div>
      <div data-testid="category-breadcrumb">{product.breadcrumb}</div>
      <h1>{product.name}</h1>
      <p>{product.price}</p>
      <p>{product.brand}</p>
      <p>{product.description}</p>
      {product.dimensions && (
        <div data-testid="product-dimensions">
          <span>{product.weight}</span>
          <span>{product.dimensions.length}</span>
          <span>{product.dimensions.width}</span>
          <span>{product.dimensions.height}</span>
        </div>
      )}
      <div data-testid="image-gallery-nav">
        {product.images.map((img) => (
          <img
            key={img.displayOrder}
            src={img.imageFile}
            alt={img.altText}
            data-testid="product-image"
          />
        ))}
      </div>
    </div>
  );
}
