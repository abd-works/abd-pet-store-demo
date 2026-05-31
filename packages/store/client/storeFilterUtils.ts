import { MOCK_STOCK_BY_PRODUCT } from '../../product-catalog/client/mock-catalog';
import type { StoreResponse } from './store.api';
import { MOCK_STORE_SPECIALIZATIONS } from './mock-stores';

export interface StoreFilterState {
  specialization?: string;
  productSku?: string;
}

export function enrichStoreWithSpecializations(store: StoreResponse): StoreResponse {
  return {
    ...store,
    storeSpecializations: MOCK_STORE_SPECIALIZATIONS[store.storeCode] ?? [],
  };
}

export function storeHasProductInStock(storeCode: string, productSku: string): boolean {
  const rows = MOCK_STOCK_BY_PRODUCT[productSku] ?? [];
  const match = rows.find((row) => row.store_code === storeCode);
  return match?.stock_label === 'In stock';
}

export function applyStoreFilters(stores: StoreResponse[], filters: StoreFilterState): StoreResponse[] {
  return stores.filter((store) => {
    if (filters.specialization) {
      const specs = store.storeSpecializations ?? MOCK_STORE_SPECIALIZATIONS[store.storeCode] ?? [];
      if (!specs.includes(filters.specialization)) return false;
    }
    if (filters.productSku && !storeHasProductInStock(store.storeCode, filters.productSku)) {
      return false;
    }
    return true;
  });
}

export const STORE_SPECIALIZATION_OPTIONS = ['reptile section', 'premium dog food'] as const;

export const PRODUCT_AVAILABILITY_OPTIONS = [
  { sku: 'PET-HAR-001', label: 'Premium Dog Harness (PET-HAR-001)' },
  { sku: 'PET-FLT-099', label: 'Cat Treats Variety Pack (PET-FLT-099)' },
] as const;
