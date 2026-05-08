/**
 * Manage Inventory -- server tests
 *
 * Story: Update Product Stock Levels (store employee)
 * Scenarios: stock update saved/rejected (parameterized), cross-store isolation
 */
import { describe, it, afterEach } from 'vitest';
import { ManageInventoryServerHelper } from './helpers/manage-inventory.server';
import { ManageInventoryBase } from './helpers/manage-inventory.base';

describe('Manage Inventory -- server', () => {
  const helper = new ManageInventoryServerHelper();

  afterEach(async () => {
    await helper.cleanup();
  });

  // ======================================================================
  // STORY: Update Product Stock Levels
  // ======================================================================

  describe('TestUpdateProductStockLevels', () => {

    it.each([...ManageInventoryBase.STOCK_UPDATE_SCENARIOS])(
      'admin form shows current stock and accepts valid update: $product_sku at $store_code -> $expected_result',
      async (scenario) => {
        // Given: StockAvailability seeded for product at store
        await helper.seed([scenario]);
        // When: store employee opens the stock form
        await helper.when_store_employee_opens_stock_form(scenario.product_sku, scenario.store_code);
        // Then: form displays current quantityOnHand
        helper.then_form_displays_current_quantity(scenario.quantity_on_hand);
        // When: store employee submits new quantityOnHand
        await helper.when_store_employee_submits_new_quantity(
          scenario.product_sku, scenario.store_code, scenario.new_quantity_on_hand,
        );
        // Then: result is saved or rejected
        if (scenario.expected_result === 'saved') {
          helper.then_stock_is_saved(scenario.new_quantity_on_hand, scenario.expected_new_available_to_sell!);
        } else {
          helper.then_stock_is_rejected();
        }
      },
    );

    it('stock update at one store does not affect another', async () => {
      // Given: PET-HAR-001 stocked at STR-001 and STR-002
      await helper.seed(ManageInventoryBase.CROSS_STORE_DATA);
      // When: store employee at STR-001 submits new quantityOnHand 40
      await helper.when_store_employee_submits_new_quantity('PET-HAR-001', 'STR-001', 40);
      // Then: STR-001 updates to quantityOnHand 40, availableToSellQuantity 37
      helper.then_stock_is_saved(40, 37);
      // And: STR-002 remains unchanged
      await helper.when_store_employee_opens_stock_form('PET-HAR-001', 'STR-002');
      helper.then_stock_unchanged(12, 11);
    });

  });
});
