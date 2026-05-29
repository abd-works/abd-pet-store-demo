/**
 * Manage Inventory -- server tests
 *
 * Story: Update Product Stock Levels (store employee)
 */
import { describe, it, afterEach } from 'vitest';
import { ManageInventoryServerHelper } from './helpers/manage-inventory.server';
import { ManageInventoryBase, StockUpdateScenarioData } from './helpers/manage-inventory.base';

// ============================================================================
// STORY: Update Product Stock Levels
// ============================================================================

class TestUpdateProductStockLevels {
  constructor(private helper: ManageInventoryServerHelper) {}

  /**
   * SCENARIO: Stock level update result
   * GIVEN: StockAvailability seeded for product at store
   * WHEN: store employee opens form and submits new quantityOnHand
   * THEN: update is saved or rejected with quantity unchanged on reject
   */
  async stock_level_update_result(scenario: StockUpdateScenarioData): Promise<void> {
    await this.helper.seed([scenario]);
    await this.helper.when_store_employee_opens_stock_form(scenario.product_sku, scenario.store_code);
    this.helper.then_form_displays_current_quantity(scenario.quantity_on_hand);
    await this.helper.when_store_employee_submits_new_quantity(
      scenario.product_sku, scenario.store_code, scenario.new_quantity_on_hand,
    );
    if (scenario.expected_result === 'saved') {
      this.helper.then_stock_is_saved(scenario.new_quantity_on_hand, scenario.expected_new_available_to_sell!);
    } else {
      this.helper.then_stock_is_rejected();
    }
  }

  /**
   * SCENARIO: Update at one store does not affect other stores
   * GIVEN: PET-HAR-001 stocked at STR-001 and STR-002
   * WHEN: store employee at STR-001 submits new quantityOnHand 40
   * THEN: STR-002 remains unchanged
   */
  async update_at_one_store_does_not_affect_another(): Promise<void> {
    await this.helper.seed(ManageInventoryBase.CROSS_STORE_DATA);
    await this.helper.when_store_employee_submits_new_quantity('PET-HAR-001', 'STR-001', 40);
    this.helper.then_stock_is_saved(40, 37);
    await this.helper.when_store_employee_opens_stock_form('PET-HAR-001', 'STR-002');
    this.helper.then_stock_unchanged(12, 11);
  }
}

// ============================================================================
// TEST WIRING
// ============================================================================

describe('Update Product Stock Levels', () => {
  const helper = new ManageInventoryServerHelper();
  const tests = new TestUpdateProductStockLevels(helper);

  afterEach(async () => { await helper.cleanup(); });

  describe('TestUpdateProductStockLevels', () => {
    it.each([...ManageInventoryBase.STOCK_UPDATE_SCENARIOS])(
      'stock level update result: $product_sku at $store_code -> $expected_result',
      async (scenario) => { await tests.stock_level_update_result(scenario); },
    );

    it('update at one store does not affect another', async () => {
      await tests.update_at_one_store_does_not_affect_another();
    });
  });
});

export { TestUpdateProductStockLevels };
