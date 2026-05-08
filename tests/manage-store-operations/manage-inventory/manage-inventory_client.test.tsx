/**
 * Manage Inventory -- client tests
 *
 * Story: Update Product Stock Levels (store employee)
 * Scenarios: stock update saved/rejected (parameterized), cross-store isolation
 */
import { describe, it, afterEach } from 'vitest';
import { ManageInventoryClientHelper } from './helpers/manage-inventory.client';
import { ManageInventoryBase } from './helpers/manage-inventory.base';

describe('Manage Inventory -- client', () => {
  const helper = new ManageInventoryClientHelper();

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
        // Given / When: store employee opens the stock form
        helper.when_store_employee_opens_stock_form(scenario);
        // Then: form displays current quantityOnHand
        await helper.then_form_displays_current_quantity(scenario.quantity_on_hand);
        // When: store employee submits new quantityOnHand
        helper.when_store_employee_submits_new_quantity(scenario.new_quantity_on_hand, scenario.expected_result);
        // Then: result is saved or rejected
        if (scenario.expected_result === 'saved') {
          await helper.then_stock_saved_confirmation_shown();
        } else {
          await helper.then_error_message_shown();
        }
      },
    );

    it('stock update at one store does not affect another', async () => {
      // Given: open form for STR-001
      const str001 = helper.given_cross_store_stock('STR-001');
      helper.when_store_employee_opens_stock_form(str001);
      // Then: form displays STR-001 quantityOnHand
      await helper.then_form_displays_current_quantity(str001.quantity_on_hand);
      // When: submit new quantityOnHand 40
      helper.when_store_employee_submits_new_quantity(40, 'saved');
      await helper.then_stock_saved_confirmation_shown();
      // And: opening form for STR-002 still shows original quantityOnHand
      await helper.cleanup();
      const str002 = helper.given_cross_store_stock('STR-002');
      helper.when_store_employee_opens_stock_form(str002);
      await helper.then_quantity_on_hand_unchanged(str002.quantity_on_hand);
    });

  });
});
