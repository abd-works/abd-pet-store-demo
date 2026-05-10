/**
 * Search and Filter Products -- E2E Tests
 *
 * Story: Display Real-Time Stock Availability (system)
 * Scenario Outline 1: Stock availability shown per store with label
 * Scenario Outline 2: Stock update recalculates available-to-sell
 */
import { test } from '@playwright/test';
import { SearchAndFilterProductsHelper } from './helpers/search-and-filter-products.base';
import { SearchAndFilterProductsE2EHelper } from './helpers/search-and-filter-products.e2e';

test.describe('DisplayRealTimeStockAvailability', () => {
  let helper: SearchAndFilterProductsE2EHelper;

  test.beforeEach(async ({ page, request }) => {
    helper = new SearchAndFilterProductsE2EHelper(page, request);
    await helper.seed();
  });

  test.afterEach(async () => {
    await helper.cleanup();
  });

  /**
   * SCENARIO: Stock availability shown per store with label
   * GIVEN: ProductCatalog contains Product with StockAvailability per store
   * WHEN: customer navigates to the product page
   * THEN: Store shows stock label matching available-to-sell quantity
   */
  for (const scenario of SearchAndFilterProductsHelper.STOCK_AVAILABILITY_SCENARIOS) {
    test(`stock availability shown per store: ${scenario.store_name} (${scenario.product_sku})`, async () => {
      // When
      await helper.whenCustomerViewsProductPage(scenario.product_sku);
      // Then
      await helper.thenStoreShowsStockLabel(scenario.store_name, scenario.expected_stock_label);
    });
  }

  /**
   * SCENARIO: Stock update recalculates available-to-sell
   * GIVEN: StockAvailability has quantityOnHand and reservedQuantity
   * WHEN: Store Employee calls updateQuantityOnHand via API
   * THEN: subsequent customer page view reflects recalculated availability
   */
  for (const scenario of SearchAndFilterProductsHelper.STOCK_UPDATE_SCENARIOS) {
    test(`stock update recalculates: ${scenario.product_sku} at ${scenario.store_code} → ${scenario.new_quantity_on_hand} units`, async () => {
      // When
      await helper.whenStoreEmployeeUpdatesQuantity(
        scenario.product_sku, scenario.store_code, scenario.new_quantity_on_hand,
      );
      // Then
      await helper.thenSubsequentViewReflectsAvailability(
        scenario.product_sku, scenario.store_code, scenario.expected_available_to_sell,
      );
    });
  }
});
