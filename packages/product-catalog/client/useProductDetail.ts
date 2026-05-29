import { useEffect, useState } from 'react';
import { fetchProductBySku, type ProductDetailDTO } from './product-catalog.api';

export function useProductDetail(sku: string) {
  const [product, setProduct] = useState<ProductDetailDTO | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchProductBySku(sku).then((detail) => {
      setProduct(detail);
      setImageIndex(0);
      setLoading(false);
    });
  }, [sku]);

  return { product, imageIndex, setImageIndex, loading };
}
