/**
 * Manage Inventory -- client tests
 *
 * Story: Update Product Stock Levels (store employee)
 */
import { describe, it, afterEach } from 'vitest';
import { ManageInventoryClientHelper } from './helpers/manage-inventory.client';
import { ManageInventoryBase, StockUpdateScenarioData } from './helpers/manage-inventory.base';

// ============================================================================
// STORY: Update Product Stock Levels
// ============================================================================

class TestUpdateProductStockLevels {
  constructor(private helper: ManageInventoryClientHelper) {}

  /**
   * SCENARIO: Current stock level displayed in admin dashboard
   * GIVEN: StockAvailability seeded for product at store
   * WHEN: store employee opens the stock form
   * THEN: form displays current quantityOnHand; submit saves or rejects
   */
  async stock_level_update_result(scenario: StockUpdateScenarioData): Promise<void> {
    this.helper.when_store_employee_opens_stock_form(scenario);
    await this.helper.then_form_displays_current_quantity(scenario.quantity_on_hand);
    this.helper.when_store_employee_submits_new_quantity(
      scenario.new_quantity_on_hand, scenario.expected_result,
    );
    if (scenario.expected_result === 'saved') {
      await this.helper.then_stock_saved_confirmation_shown();
    } else {
      await this.helper.then_error_message_shown();
    }
  }

  /**
   * SCENARIO: Update at one store does not affect other stores
   * GIVEN: PET-HAR-001 stocked at STR-001 and STR-002
   * WHEN: store employee at STR-001 submits new quantityOnHand 40
   * THEN: STR-002 form still shows original quantityOnHand
   */
  async update_at_one_store_does_not_affect_another(): Promise<void> {
    const str001 = this.helper.given_cross_store_stock('STR-001');
    this.helper.when_store_employee_opens_stock_form(str001);
    await this.helper.then_form_displays_current_quantity(str001.quantity_on_hand);
    this.helper.when_store_employee_submits_new_quantity(40, 'saved');
    await this.helper.then_stock_saved_confirmation_shown();
    await this.helper.cleanup();
    const str002 = this.helper.given_cross_store_stock('STR-002');
    this.helper.when_store_employee_opens_stock_form(str002);
    await this.helper.then_quantity_on_hand_unchanged(str002.quantity_on_hand);
  }
}

// ============================================================================
// TEST WIRING
// ============================================================================

describe('Update Product Stock Levels', () => {
  const helper = new ManageInventoryClientHelper();
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
