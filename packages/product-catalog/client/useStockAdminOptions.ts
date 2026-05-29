import { useEffect, useState } from 'react';
import { fetchProducts } from './product-catalog.api';
import { fetchStores, type StoreResponse } from '../../store/client/store.api';

export function useStockAdminOptions() {
  const [stores, setStores] = useState<StoreResponse[]>([]);
  const [products, setProducts] = useState<{ sku: string; name: string }[]>([]);

  useEffect(() => {
    fetchStores().then(setStores);
    fetchProducts().then((list) =>
      setProducts(list.map((product) => ({ sku: product.sku, name: product.name }))),
    );
  }, []);

  return { stores, products };
}
