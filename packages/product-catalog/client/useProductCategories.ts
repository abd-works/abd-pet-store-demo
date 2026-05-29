import { useMemo } from 'react';
import type { ProductSummaryDTO } from './product-catalog.api';

export function useProductCategories(products: ProductSummaryDTO[]) {
  return useMemo(() => {
    const names = products
      .map((product) => product.category_name)
      .filter((name): name is string => Boolean(name));
    return [...new Set(names)].sort();
  }, [products]);
}
