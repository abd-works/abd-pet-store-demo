/**
 * Search and Filter Products -- Server Tests
 *
 * Story: Display Real-Time Stock Availability (system)
 * Scenario Outline 1: Stock availability shown per store with label
 * Scenario Outline 2: Stock update recalculates available-to-sell
 */
import { describe, it, beforeEach, afterEach } from 'vitest';
import { SearchAndFilterProductsHelper } from './helpers/search-and-filter-products.base';
import { SearchAndFilterProductsServerHelper } from './helpers/search-and-filter-products.server';

describe('DisplayRealTimeStockAvailability', () => {
  const helper = new SearchAndFilterProductsServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  /**
   * SCENARIO: Stock availability shown per store with label
   * GIVEN: ProductCatalog contains Product with StockAvailability per store
   * WHEN: customer views the product page via GET /api/products/:sku/stock
   * THEN: Store shows stock label matching available-to-sell quantity
   */
  it.each([...SearchAndFilterProductsHelper.STOCK_AVAILABILITY_SCENARIOS])(
    'stock availability shown per store with label: $store_name ($product_sku)',
    async ({ product_sku, store_name, expected_stock_label }) => {
      // When
      const response = await helper.whenCustomerViewsProductStock(product_sku);
      // Then
      helper.thenStoreShowsStockLabel(response, store_name, expected_stock_label);
    },
  );

  /**
   * SCENARIO: Stock update recalculates available-to-sell
   * GIVEN: StockAvailability has quantityOnHand and reservedQuantity
   * WHEN: Store Employee calls updateQuantityOnHand via PUT /api/stock/:sku/:store
   * THEN: availableToSellQuantity recalculates
   * AND: subsequent customer views reflect new availability
   */
  it.each([...SearchAndFilterProductsHelper.STOCK_UPDATE_SCENARIOS])(
    'stock update recalculates available-to-sell: $product_sku at $store_code',
    async ({ product_sku, store_code, new_quantity_on_hand, expected_available_to_sell }) => {
      // When
      const response = await helper.whenStoreEmployeeUpdatesQuantity(
        product_sku, store_code, new_quantity_on_hand,
      );
      // Then
      helper.thenAvailableToSellRecalculates(response, expected_available_to_sell);
      // And -- subsequent customer view
      await helper.thenSubsequentViewReflectsAvailability(
        product_sku, store_code, expected_available_to_sell,
      );
    },
  );
});
