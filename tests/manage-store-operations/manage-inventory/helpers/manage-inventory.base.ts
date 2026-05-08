/**
 * Manage Inventory -- base helper
 *
 * Story: Update Product Stock Levels (store employee)
 * Scenarios: stock update saved/rejected (parameterized), cross-store isolation
 */
import { StockAvailability, Product } from '@pawplace/product-catalog-shared';
import { Store } from '@pawplace/store-shared';

// ============================================================================
// STANDARD TEST DATA
// ============================================================================

export interface StockSeedData {
  product_sku: string;
  product_name: string;
  store_code: string;
  store_name: string;
  quantity_on_hand: number;
  reserved_quantity: number;
  available_to_sell_quantity: number;
}

export interface StockUpdateScenarioData extends StockSeedData {
  new_quantity_on_hand: number;
  expected_new_available_to_sell: number | null;
  expected_result: 'saved' | 'rejected';
}

export abstract class ManageInventoryBase {

  static readonly STOCK_UPDATE_SCENARIOS: readonly StockUpdateScenarioData[] = [
    {
      product_sku: 'PET-HAR-001', product_name: 'Premium Dog Harness',
      store_code: 'STR-001', store_name: 'PawPlace Camden',
      quantity_on_hand: 25, reserved_quantity: 3, available_to_sell_quantity: 22,
      new_quantity_on_hand: 40, expected_new_available_to_sell: 37,
      expected_result: 'saved',
    },
    {
      product_sku: 'PET-TRT-042', product_name: 'Salmon Cat Treats',
      store_code: 'STR-002', store_name: 'PawPlace Bristol',
      quantity_on_hand: 50, reserved_quantity: 2, available_to_sell_quantity: 48,
      new_quantity_on_hand: -5, expected_new_available_to_sell: null,
      expected_result: 'rejected',
    },
    {
      product_sku: 'PET-HAR-001', product_name: 'Premium Dog Harness',
      store_code: 'STR-002', store_name: 'PawPlace Bristol',
      quantity_on_hand: 12, reserved_quantity: 1, available_to_sell_quantity: 11,
      new_quantity_on_hand: 30, expected_new_available_to_sell: 29,
      expected_result: 'saved',
    },
  ] as const;

  static readonly CROSS_STORE_DATA: readonly StockSeedData[] = [
    {
      product_sku: 'PET-HAR-001', product_name: 'Premium Dog Harness',
      store_code: 'STR-001', store_name: 'PawPlace Camden',
      quantity_on_hand: 25, reserved_quantity: 3, available_to_sell_quantity: 22,
    },
    {
      product_sku: 'PET-HAR-001', product_name: 'Premium Dog Harness',
      store_code: 'STR-002', store_name: 'PawPlace Bristol',
      quantity_on_hand: 12, reserved_quantity: 1, available_to_sell_quantity: 11,
    },
  ] as const;

  // -- seed / cleanup (tier-specific) ------------------------------------

  abstract seed(data: readonly StockSeedData[]): Promise<void>;
  abstract cleanup(): Promise<void>;

  // -- GIVEN helpers (shared across tiers) --------------------------------

  given_stock_scenario(product_sku: string, store_code: string): StockUpdateScenarioData {
    return ManageInventoryBase.STOCK_UPDATE_SCENARIOS.find(
      s => s.product_sku === product_sku && s.store_code === store_code
    )!;
  }

  given_cross_store_stock(store_code: string): StockSeedData {
    return ManageInventoryBase.CROSS_STORE_DATA.find(s => s.store_code === store_code)!;
  }
}
