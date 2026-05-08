/**
 * Search and Filter Products -- Client Tests
 *
 * Story: Display Real-Time Stock Availability (system)
 * Scenario Outline 1: Stock availability shown per store with label
 * Scenario Outline 2: Stock update recalculates available-to-sell
 */
import { describe, it, afterEach } from 'vitest';
import { SearchAndFilterProductsHelper } from './helpers/search-and-filter-products.base';
import { SearchAndFilterProductsClientHelper } from './helpers/search-and-filter-products.client';

describe('DisplayRealTimeStockAvailability', () => {
  const helper = new SearchAndFilterProductsClientHelper();

  afterEach(async () => { await helper.cleanup(); });

  /**
   * SCENARIO: Stock availability shown per store with label
   * GIVEN: API returns StockAvailability per store for a product
   * WHEN: customer views the StockAvailabilityDisplay component
   * THEN: Store shows stock label matching available-to-sell quantity
   */
  it.each([...SearchAndFilterProductsHelper.STOCK_AVAILABILITY_SCENARIOS])(
    'stock availability shown per store with label: $store_name ($product_sku)',
    async ({ product_sku, store_name, expected_stock_label }) => {
      // Given
      helper.givenMockedStockResponse(product_sku, SearchAndFilterProductsHelper.STOCK_AVAILABILITY_SCENARIOS);
      // When
      helper.whenCustomerViewsProductPage(product_sku);
      // Then
      await helper.thenStoreShowsStockLabel(store_name, expected_stock_label);
    },
  );

  /**
   * SCENARIO: Stock update recalculates available-to-sell
   * GIVEN: API returns updated StockAvailability after quantity change
   * WHEN: component renders with new stock data
   * THEN: display reflects recalculated availableToSellQuantity
   */
  it.each([...SearchAndFilterProductsHelper.STOCK_UPDATE_SCENARIOS])(
    'stock update reflected in display: $product_sku at $store_code',
    async ({ product_sku, store_code, expected_available_to_sell }) => {
      // Given
      helper.givenMockedUpdatedStock(product_sku, store_code, expected_available_to_sell);
      // When
      helper.whenCustomerViewsProductPage(product_sku);
      // Then
      await helper.thenStoreShowsAvailableQuantity(store_code, expected_available_to_sell);
    },
  );
});
