/**
 * Manage Inventory -- E2E tests
 *
 * Story: Update Product Stock Levels (store employee)
 * Scenarios: stock update saved/rejected (parameterized), cross-store isolation
 */
import { test } from '@playwright/test';
import { ManageInventoryE2EHelper } from './helpers/manage-inventory.e2e';
import { ManageInventoryBase } from './helpers/manage-inventory.base';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';

test.describe('Manage Inventory -- E2E', () => {

  // ======================================================================
  // STORY: Update Product Stock Levels
  // ======================================================================

  test.describe('TestUpdateProductStockLevels', () => {

    for (const scenario of ManageInventoryBase.STOCK_UPDATE_SCENARIOS) {
      test(`admin form shows current stock and accepts valid update: ${scenario.product_sku} at ${scenario.store_code} -> ${scenario.expected_result}`, async ({ page }) => {
        const helper = new ManageInventoryE2EHelper(page, BASE_URL);
        // Given: StockAvailability seeded for product at store
        await helper.seed([scenario]);
        try {
          // When: store employee opens the stock form
          await helper.when_store_employee_opens_stock_form(scenario.product_sku, scenario.store_code);
          // Then: form displays current quantityOnHand
          await helper.then_form_displays_current_quantity(scenario.quantity_on_hand);
          // When: store employee submits new quantityOnHand
          await helper.when_store_employee_submits_new_quantity(scenario.new_quantity_on_hand);
          // Then: result is saved or rejected
          if (scenario.expected_result === 'saved') {
            await helper.then_stock_is_saved(scenario.new_quantity_on_hand, scenario.expected_new_available_to_sell!);
          } else {
            await helper.then_stock_is_rejected();
          }
        } finally {
          await helper.cleanup();
        }
      });
    }

    test('stock update at one store does not affect another', async ({ page }) => {
      const helper = new ManageInventoryE2EHelper(page, BASE_URL);
      // Given: PET-HAR-001 stocked at STR-001 and STR-002
      await helper.seed(ManageInventoryBase.CROSS_STORE_DATA);
      try {
        // When: store employee at STR-001 submits new quantityOnHand 40
        await helper.when_store_employee_opens_stock_form('PET-HAR-001', 'STR-001');
        await helper.when_store_employee_submits_new_quantity(40);
        // Then: STR-001 updates
        await helper.then_stock_is_saved(40, 37);
        // And: STR-002 remains unchanged
        await helper.when_store_employee_opens_stock_form('PET-HAR-001', 'STR-002');
        await helper.then_stock_unchanged(12, 11);
      } finally {
        await helper.cleanup();
      }
    });

  });
});
