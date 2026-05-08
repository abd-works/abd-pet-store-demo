/**
 * Search and Filter Products -- Server Helper
 *
 * Story: Display Real-Time Stock Availability
 * Seeds MongoDB via test API. WHEN: supertest. THEN: node:assert.
 */
import assert from 'node:assert';
import request from 'supertest';
import { app } from '@pawplace/app-server';
import { SearchAndFilterProductsHelper } from './search-and-filter-products.base';

export class SearchAndFilterProductsServerHelper extends SearchAndFilterProductsHelper {
  private createdIds: string[] = [];

  async seed(): Promise<void> {
    const res = await request(app).post('/api/test/stock-availability').send({
      products: SearchAndFilterProductsHelper.PRODUCTS,
      stores: SearchAndFilterProductsHelper.STORES,
      stock_availability: SearchAndFilterProductsHelper.STOCK_AVAILABILITY_SCENARIOS,
      stock_updates: SearchAndFilterProductsHelper.STOCK_UPDATE_SCENARIOS,
    });
    this.createdIds = res.body.ids;
  }

  async cleanup(): Promise<void> {
    if (this.createdIds.length === 0) return;
    await request(app).delete('/api/test/stock-availability').send({ ids: this.createdIds });
    this.createdIds = [];
  }

  async whenCustomerViewsProductStock(product_sku: string) {
    return request(app).get(`/api/products/${product_sku}/stock`).expect(200);
  }

  async whenStoreEmployeeUpdatesQuantity(product_sku: string, store_code: string, new_quantity_on_hand: number) {
    return request(app)
      .put(`/api/stock/${product_sku}/${store_code}`)
      .send({ quantity_on_hand: new_quantity_on_hand })
      .expect(200);
  }

  thenStoreShowsStockLabel(response: request.Response, store_name: string, expected_stock_label: string): void {
    const store = response.body.stores.find((s: { store_name: string }) => s.store_name === store_name);
    assert.ok(store, `No store entry found for ${store_name}`);
    assert.strictEqual(store.stock_label, expected_stock_label);
  }

  thenAvailableToSellRecalculates(response: request.Response, expected_available_to_sell: number): void {
    assert.strictEqual(response.body.available_to_sell_quantity, expected_available_to_sell);
  }

  async thenSubsequentViewReflectsAvailability(product_sku: string, store_code: string, expected_available_to_sell: number): Promise<void> {
    const response = await this.whenCustomerViewsProductStock(product_sku);
    const store = response.body.stores.find((s: { store_code: string }) => s.store_code === store_code);
    assert.strictEqual(store.available_to_sell_quantity, expected_available_to_sell);
  }
}
