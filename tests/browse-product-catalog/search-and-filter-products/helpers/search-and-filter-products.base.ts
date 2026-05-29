/**
 * Search and Filter Products -- Base Helper
 *
 * Story: Display Real-Time Stock Availability
 * Shared test data and abstract tier interface.
 */
import type { Product, StockAvailability } from '@pawplace/product-catalog-shared';
import type { Store } from '@pawplace/store-shared';

export interface StockAvailabilityScenario {
  product_name: string;
  product_sku: string;
  store_code: string;
  store_name: string;
  quantity_on_hand: number;
  reserved_quantity: number;
  available_to_sell_quantity: number;
  backorder_enabled: boolean;
  expected_stock_label: string;
}

export interface StockUpdateScenario {
  product_sku: string;
  store_code: string;
  original_quantity_on_hand: number;
  reserved_quantity: number;
  new_quantity_on_hand: number;
  expected_available_to_sell: number;
}

export abstract class SearchAndFilterProductsHelper {

  static readonly PRODUCTS = [
    { product_name: 'Premium Dog Harness', product_sku: 'PET-HAR-001' },
    { product_name: 'Exotic Fish Filter', product_sku: 'PET-FLT-099' },
    { product_name: 'Salmon Cat Treats', product_sku: 'PET-TRT-042' },
  ] as const;

  static readonly STORES = [
    { store_code: 'STR-001', store_name: 'PawPlace Camden' },
    { store_code: 'STR-002', store_name: 'PawPlace Bristol' },
  ] as const;

  static readonly STOCK_AVAILABILITY_SCENARIOS: readonly StockAvailabilityScenario[] = [
    { product_name: 'Premium Dog Harness', product_sku: 'PET-HAR-001', store_code: 'STR-001', store_name: 'PawPlace Camden', quantity_on_hand: 25, reserved_quantity: 3, available_to_sell_quantity: 22, backorder_enabled: false, expected_stock_label: 'In Stock' },
    { product_name: 'Premium Dog Harness', product_sku: 'PET-HAR-001', store_code: 'STR-002', store_name: 'PawPlace Bristol', quantity_on_hand: 8, reserved_quantity: 0, available_to_sell_quantity: 8, backorder_enabled: false, expected_stock_label: 'In Stock' },
    { product_name: 'Exotic Fish Filter', product_sku: 'PET-FLT-099', store_code: 'STR-001', store_name: 'PawPlace Camden', quantity_on_hand: 0, reserved_quantity: 0, available_to_sell_quantity: 0, backorder_enabled: false, expected_stock_label: 'Out of Stock' },
    { product_name: 'Exotic Fish Filter', product_sku: 'PET-FLT-099', store_code: 'STR-002', store_name: 'PawPlace Bristol', quantity_on_hand: 0, reserved_quantity: 0, available_to_sell_quantity: 0, backorder_enabled: false, expected_stock_label: 'Out of Stock' },
  ];

  static readonly STOCK_UPDATE_SCENARIOS: readonly StockUpdateScenario[] = [
    { product_sku: 'PET-HAR-001', store_code: 'STR-001', original_quantity_on_hand: 25, reserved_quantity: 3, new_quantity_on_hand: 40, expected_available_to_sell: 37 },
    { product_sku: 'PET-HAR-001', store_code: 'STR-001', original_quantity_on_hand: 25, reserved_quantity: 3, new_quantity_on_hand: 3, expected_available_to_sell: 0 },
    { product_sku: 'PET-TRT-042', store_code: 'STR-002', original_quantity_on_hand: 50, reserved_quantity: 2, new_quantity_on_hand: 100, expected_available_to_sell: 98 },
  ];

  abstract seed(): Promise<void>;
  abstract cleanup(): Promise<void>;

  givenProductData(product_sku: string) {
    return SearchAndFilterProductsHelper.PRODUCTS.find(p => p.product_sku === product_sku)!;
  }

  givenStockData(product_sku: string, store_code: string) {
    return SearchAndFilterProductsHelper.STOCK_AVAILABILITY_SCENARIOS
      .find(s => s.product_sku === product_sku && s.store_code === store_code)!;
  }
}
