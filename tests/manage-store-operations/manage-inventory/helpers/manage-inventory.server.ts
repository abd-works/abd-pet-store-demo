/**
 * Manage Inventory -- server helper
 *
 * Seeds via MongoDB, acts via supertest, asserts with node:assert.
 */
import request from 'supertest';
import assert from 'node:assert/strict';
import { app } from '@pawplace/app-server';
import { ManageInventoryBase, StockSeedData } from './manage-inventory.base';

export class ManageInventoryServerHelper extends ManageInventoryBase {
  private createdKeys: string[] = [];
  private response: request.Response | null = null;

  async seed(data: readonly StockSeedData[]): Promise<void> {
    for (const s of data) {
      await request(app).post('/api/test/stock').send({
        product_sku: s.product_sku, product_name: s.product_name,
        store_code: s.store_code, store_name: s.store_name,
        quantity_on_hand: s.quantity_on_hand, reserved_quantity: s.reserved_quantity,
      });
      this.createdKeys.push(`${s.product_sku}:${s.store_code}`);
    }
  }

  async cleanup(): Promise<void> {
    if (this.createdKeys.length === 0) return;
    await request(app).delete('/api/test/stock').send({ keys: this.createdKeys });
    this.createdKeys = [];
  }

  // -- WHEN ---------------------------------------------------------------

  async when_store_employee_opens_stock_form(product_sku: string, store_code: string): Promise<void> {
    this.response = await request(app).get(`/api/stock/${product_sku}/${store_code}`);
  }

  async when_store_employee_submits_new_quantity(product_sku: string, store_code: string, new_quantity_on_hand: number): Promise<void> {
    this.response = await request(app)
      .put(`/api/stock/${product_sku}/${store_code}`)
      .send({ quantity_on_hand: new_quantity_on_hand });
  }

  // -- THEN ---------------------------------------------------------------

  then_form_displays_current_quantity(expected_quantity_on_hand: number): void {
    assert.equal(this.response!.status, 200);
    assert.equal(this.response!.body.quantityOnHand, expected_quantity_on_hand);
  }

  then_stock_is_saved(expected_quantity_on_hand: number, expected_available_to_sell: number): void {
    assert.equal(this.response!.status, 200);
    assert.equal(this.response!.body.quantityOnHand, expected_quantity_on_hand);
    assert.equal(this.response!.body.availableToSellQuantity, expected_available_to_sell);
  }

  then_stock_is_rejected(): void {
    assert.equal(this.response!.status, 400);
  }

  then_stock_unchanged(expected_quantity_on_hand: number, expected_available_to_sell: number): void {
    assert.equal(this.response!.status, 200);
    assert.equal(this.response!.body.quantityOnHand, expected_quantity_on_hand);
    assert.equal(this.response!.body.availableToSellQuantity, expected_available_to_sell);
  }
}
