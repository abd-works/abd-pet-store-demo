/**
 * Search and Filter Products -- Client Tests
 *
 * Story: Display Real-Time Stock Availability (system)
 */
import { describe, it, afterEach } from 'vitest';
import { SearchAndFilterProductsHelper } from './helpers/search-and-filter-products.base';
import { SearchAndFilterProductsClientHelper } from './helpers/search-and-filter-products.client';
import type { StockAvailabilityScenario, StockUpdateScenario } from './helpers/search-and-filter-products.base';

// ============================================================================
// STORY: Display Real-Time Stock Availability
// ============================================================================

class TestDisplayRealTimeStockAvailability {
  constructor(private helper: SearchAndFilterProductsClientHelper) {}

  /**
   * SCENARIO: Real-time stock shown per store
   * GIVEN: API returns StockAvailability per store for a product
   * WHEN: customer views the StockAvailabilityDisplay component
   * THEN: Store shows walk-in stock label (status only, no counts)
   */
  async real_time_stock_shown_per_store(scenario: StockAvailabilityScenario): Promise<void> {
    this.helper.givenMockedStockResponse(
      scenario.product_sku,
      SearchAndFilterProductsHelper.STOCK_AVAILABILITY_SCENARIOS,
    );
    this.helper.whenCustomerViewsProductPage(scenario.product_sku);
    await this.helper.thenStoreShowsStockLabel(scenario.store_name, scenario.expected_stock_label);
    await this.helper.thenWalkInSurfaceShowsLabelsOnly();
  }

  /**
   * SCENARIO: Out of stock shown clearly with no purchase option
   * GIVEN: Product is out of stock at all seeded stores
   * WHEN: customer views the product page stock section
   * THEN: Out of Stock label shown; no purchase/backorder actions
   */
  async out_of_stock_shown_with_no_purchase_option(): Promise<void> {
    this.helper.givenMockedStockResponse(
      'PET-FLT-099',
      SearchAndFilterProductsHelper.STOCK_AVAILABILITY_SCENARIOS,
    );
    this.helper.whenCustomerViewsProductPage('PET-FLT-099');
    await this.helper.thenStoreShowsStockLabel('PawPlace Camden', 'Out of Stock');
    await this.helper.thenWalkInSurfaceShowsLabelsOnly();
    await this.helper.thenNoPurchaseOrBackorderActions();
  }

  /**
   * SCENARIO: Stock updates reflected on next view
   * GIVEN: API returns updated walk-in labels after ATS recalculation
   * WHEN: customer views StockAvailabilityDisplay
   * THEN: per-store Walk-in stock label reflects new availability status (counts not shown)
   */
  async stock_update_reflected_on_next_view(scenario: StockUpdateScenario): Promise<void> {
    this.helper.givenMockedUpdatedStock(
      scenario.product_sku,
      scenario.store_code,
      scenario.expected_available_to_sell,
    );
    this.helper.whenCustomerViewsProductPage(scenario.product_sku);
    const storeMeta = SearchAndFilterProductsHelper.STORES.find((s) => s.store_code === scenario.store_code);
    if (!storeMeta) throw new Error(`Missing store fixture for ${scenario.store_code}`);
    await this.helper.thenWalkInReflectsAvailabilityLabel(
      storeMeta.store_name,
      scenario.expected_available_to_sell,
    );
    await this.helper.thenWalkInSurfaceShowsLabelsOnly();
  }
}

// ============================================================================
// TEST WIRING
// ============================================================================

describe('Display Real-Time Stock Availability', () => {
  const helper = new SearchAndFilterProductsClientHelper();
  const tests = new TestDisplayRealTimeStockAvailability(helper);

  afterEach(async () => { await helper.cleanup(); });

  describe('TestDisplayRealTimeStockAvailability', () => {
    it.each([...SearchAndFilterProductsHelper.STOCK_AVAILABILITY_SCENARIOS])(
      'real-time stock shown per store: $store_name ($product_sku)',
      async (scenario) => { await tests.real_time_stock_shown_per_store(scenario); },
    );

    it('out of stock shown clearly with no purchase option', async () => {
      await tests.out_of_stock_shown_with_no_purchase_option();
    });

    it.each([...SearchAndFilterProductsHelper.STOCK_UPDATE_SCENARIOS])(
      'stock update reflected on next view: $product_sku at $store_code',
      async (scenario) => { await tests.stock_update_reflected_on_next_view(scenario); },
    );
  });
});

export { TestDisplayRealTimeStockAvailability };
