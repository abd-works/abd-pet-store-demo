/**
 * Search and Filter Products -- Server Tests
 *
 * Story: Display Real-Time Stock Availability (system)
 */
import { describe, it, beforeEach, afterEach } from 'vitest';
import { SearchAndFilterProductsHelper } from './helpers/search-and-filter-products.base';
import { SearchAndFilterProductsServerHelper } from './helpers/search-and-filter-products.server';
import type { StockAvailabilityScenario, StockUpdateScenario } from './helpers/search-and-filter-products.base';

// ============================================================================
// STORY: Display Real-Time Stock Availability
// ============================================================================

class TestDisplayRealTimeStockAvailability {
  constructor(private helper: SearchAndFilterProductsServerHelper) {}

  /**
   * SCENARIO: Real-time stock shown per store
   * GIVEN: ProductCatalog contains Product with StockAvailability per store
   * WHEN: customer views the product page via GET /api/products/:sku/stock
   * THEN: Store shows walk-in stock label (status only)
   */
  async real_time_stock_shown_per_store(scenario: StockAvailabilityScenario): Promise<void> {
    const response = await this.helper.whenCustomerViewsProductStock(scenario.product_sku);
    this.helper.thenCustomerStockOmitsRawCounts(response);
    this.helper.thenStoreShowsStockLabel(response, scenario.store_name, scenario.expected_stock_label);
  }

  /**
   * SCENARIO: Stock update recalculates available-to-sell
   * GIVEN: StockAvailability has quantityOnHand and reservedQuantity
   * WHEN: Store Employee updates stock via PUT /api/stock/:sku/:store
   * THEN: availableToSellQuantity recalculates and subsequent views reflect it
   */
  async stock_update_recalculates_available_to_sell(scenario: StockUpdateScenario): Promise<void> {
    const response = await this.helper.whenStoreEmployeeUpdatesQuantity(
      scenario.product_sku, scenario.store_code, scenario.new_quantity_on_hand,
    );
    this.helper.thenAvailableToSellRecalculates(response, scenario.expected_available_to_sell);
    await this.helper.thenSubsequentViewReflectsAvailability(
      scenario.product_sku, scenario.store_code, scenario.expected_available_to_sell,
    );
    const customerView = await this.helper.whenCustomerViewsProductStock(scenario.product_sku);
    this.helper.thenCustomerStockOmitsRawCounts(customerView);
  }
}

// ============================================================================
// TEST WIRING
// ============================================================================

describe('Display Real-Time Stock Availability', () => {
  const helper = new SearchAndFilterProductsServerHelper();
  const tests = new TestDisplayRealTimeStockAvailability(helper);

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  describe('TestDisplayRealTimeStockAvailability', () => {
    it.each([...SearchAndFilterProductsHelper.STOCK_AVAILABILITY_SCENARIOS])(
      'real-time stock shown per store: $store_name ($product_sku)',
      async (scenario) => { await tests.real_time_stock_shown_per_store(scenario); },
    );

    it.each([...SearchAndFilterProductsHelper.STOCK_UPDATE_SCENARIOS])(
      'stock update recalculates available-to-sell: $product_sku at $store_code',
      async (scenario) => { await tests.stock_update_recalculates_available_to_sell(scenario); },
    );
  });
});

export { TestDisplayRealTimeStockAvailability };
