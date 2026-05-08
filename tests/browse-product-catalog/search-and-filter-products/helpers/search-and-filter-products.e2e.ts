/**
 * Search and Filter Products -- E2E Helper
 *
 * Story: Display Real-Time Stock Availability
 * Seeds via API test endpoint. WHEN: Playwright page. THEN: Playwright expect.
 */
import { expect, type Page, type APIRequestContext } from '@playwright/test';
import { SearchAndFilterProductsHelper } from './search-and-filter-products.base';

export class SearchAndFilterProductsE2EHelper extends SearchAndFilterProductsHelper {
  private createdIds: string[] = [];

  constructor(private page: Page, private request: APIRequestContext) {
    super();
  }

  async seed(): Promise<void> {
    const res = await this.request.post('/api/test/stock-availability', {
      data: {
        products: SearchAndFilterProductsHelper.PRODUCTS,
        stores: SearchAndFilterProductsHelper.STORES,
        stock_availability: SearchAndFilterProductsHelper.STOCK_AVAILABILITY_SCENARIOS,
        stock_updates: SearchAndFilterProductsHelper.STOCK_UPDATE_SCENARIOS,
      },
    });
    this.createdIds = (await res.json()).ids;
  }

  async cleanup(): Promise<void> {
    if (this.createdIds.length === 0) return;
    await this.request.delete('/api/test/stock-availability', {
      data: { ids: this.createdIds },
    });
    this.createdIds = [];
  }

  async whenCustomerViewsProductPage(product_sku: string): Promise<void> {
    await this.page.goto(`/products/${product_sku}`);
  }

  async whenStoreEmployeeUpdatesQuantity(product_sku: string, store_code: string, new_quantity_on_hand: number): Promise<void> {
    await this.request.put(`/api/stock/${product_sku}/${store_code}`, {
      data: { quantity_on_hand: new_quantity_on_hand },
    });
  }

  async thenStoreShowsStockLabel(store_name: string, expected_stock_label: string): Promise<void> {
    const label = this.page.getByTestId(`stock-label-${store_name}`);
    await expect(label).toHaveText(expected_stock_label);
  }

  async thenSubsequentViewReflectsAvailability(product_sku: string, store_code: string, expected_available_to_sell: number): Promise<void> {
    await this.page.goto(`/products/${product_sku}`);
    const storeRow = this.page.getByTestId(`stock-${store_code}`);
    await expect(storeRow).toContainText(String(expected_available_to_sell));
  }
}
