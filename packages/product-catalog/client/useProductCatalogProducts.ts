import { useEffect, useState } from 'react';
import { fetchProducts, type ProductSummaryDTO } from './product-catalog.api';

export function useProductCatalogProducts(category: string) {
  const [products, setProducts] = useState<ProductSummaryDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchProducts(category || undefined).then((rows) => {
      setProducts(rows);
      setLoading(false);
    });
  }, [category]);

  return { products, loading };
}
