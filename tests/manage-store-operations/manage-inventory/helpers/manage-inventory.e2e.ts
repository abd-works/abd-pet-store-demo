/**
 * Manage Inventory -- E2E helper
 *
 * Seeds via API, navigates and asserts with Playwright.
 */
import { Page, expect } from '@playwright/test';
import { ManageInventoryBase, StockSeedData } from './manage-inventory.base';

export class ManageInventoryE2EHelper extends ManageInventoryBase {
  private createdKeys: string[] = [];

  constructor(private readonly page: Page, private readonly baseUrl: string) {
    super();
  }

  async seed(data: readonly StockSeedData[]): Promise<void> {
    for (const s of data) {
      await this.page.request.post(`${this.baseUrl}/api/test/stock`, {
        data: {
          product_sku: s.product_sku, product_name: s.product_name,
          store_code: s.store_code, store_name: s.store_name,
          quantity_on_hand: s.quantity_on_hand, reserved_quantity: s.reserved_quantity,
        },
      });
      this.createdKeys.push(`${s.product_sku}:${s.store_code}`);
    }
  }

  async cleanup(): Promise<void> {
    if (this.createdKeys.length === 0) return;
    await this.page.request.delete(`${this.baseUrl}/api/test/stock`, {
      data: { keys: this.createdKeys },
    });
    this.createdKeys = [];
  }

  // -- WHEN ---------------------------------------------------------------

  async when_store_employee_opens_stock_form(product_sku: string, store_code: string): Promise<void> {
    await this.page.goto(`${this.baseUrl}/admin/stock/${product_sku}/${store_code}`);
  }

  async when_store_employee_submits_new_quantity(new_quantity_on_hand: number): Promise<void> {
    await this.page.getByLabel(/quantity on hand/i).fill(String(new_quantity_on_hand));
    await this.page.getByRole('button', { name: /update stock/i }).click();
  }

  // -- THEN ---------------------------------------------------------------

  async then_form_displays_current_quantity(expected_quantity_on_hand: number): Promise<void> {
    await expect(this.page.getByLabel(/quantity on hand/i)).toHaveValue(String(expected_quantity_on_hand));
  }

  async then_stock_is_saved(expected_quantity_on_hand: number, expected_available_to_sell: number): Promise<void> {
    await expect(this.page.getByText(/stock updated/i)).toBeVisible();
    await expect(this.page.getByTestId('quantity-on-hand')).toHaveText(String(expected_quantity_on_hand));
    await expect(this.page.getByTestId('available-to-sell')).toHaveText(String(expected_available_to_sell));
  }

  async then_stock_is_rejected(): Promise<void> {
    await expect(this.page.getByRole('alert')).toBeVisible();
  }

  async then_stock_unchanged(expected_quantity_on_hand: number, expected_available_to_sell: number): Promise<void> {
    await expect(this.page.getByTestId('quantity-on-hand')).toHaveText(String(expected_quantity_on_hand));
    await expect(this.page.getByTestId('available-to-sell')).toHaveText(String(expected_available_to_sell));
  }
}
