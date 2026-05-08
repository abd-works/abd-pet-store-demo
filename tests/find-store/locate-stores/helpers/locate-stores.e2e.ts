import { Page, expect } from '@playwright/test';
import { LocateStoresHelper, StoreTestData } from './locate-stores.base';

export class LocateStoresE2EHelper extends LocateStoresHelper {
  private createdStoreCodes: string[] = [];

  constructor(private page: Page) {
    super();
  }

  async given_stores_seeded(): Promise<void> {
    for (const store of LocateStoresHelper.STORES) {
      await this.page.request.post('/api/test/stores', {
        data: LocateStoresHelper.toStoreObject(store),
      });
      this.createdStoreCodes.push(store.store_code);
    }
  }

  async cleanup(): Promise<void> {
    if (this.createdStoreCodes.length === 0) return;
    await this.page.request.delete('/api/test/stores', {
      data: { codes: this.createdStoreCodes },
    });
    this.createdStoreCodes = [];
  }

  async when_visitor_opens_map_view(): Promise<void> {
    await this.page.goto('/store-locator');
    await this.page.getByRole('tab', { name: 'Map' }).click();
  }

  async when_visitor_selects_store(store_name: string): Promise<void> {
    await this.page.getByLabel(store_name).click();
  }

  async when_visitor_opens_list_view(): Promise<void> {
    await this.page.goto('/store-locator');
    await this.page.getByRole('tab', { name: 'List' }).click();
  }

  async when_customer_shares_location(): Promise<void> {
    await this.page.getByRole('button', { name: 'Share Location' }).click();
  }

  async when_customer_enters_postcode(postcode: string): Promise<void> {
    await this.page.getByLabel('Postcode').fill(postcode);
    await this.page.getByRole('button', { name: 'Find' }).click();
  }

  async when_visitor_opens_store_locator(): Promise<void> {
    await this.page.goto('/store-locator');
  }

  async then_map_point_visible(store: StoreTestData): Promise<void> {
    await expect(this.page.getByLabel(store.store_name)).toBeVisible();
  }

  async then_detail_shows_address(store: StoreTestData): Promise<void> {
    await expect(this.page.getByText(store.address_line_one)).toBeVisible();
    await expect(this.page.getByText(store.city)).toBeVisible();
    await expect(this.page.getByText(store.postcode)).toBeVisible();
  }

  async then_detail_shows_contact(store: StoreTestData): Promise<void> {
    await expect(this.page.getByText(store.phone_number)).toBeVisible();
    await expect(this.page.getByText(store.email_address)).toBeVisible();
  }

  async then_store_at_list_position(
    store: StoreTestData,
    expected_list_position: number,
  ): Promise<void> {
    const entry = this.page.getByTestId('store-list-entry').nth(expected_list_position - 1);
    await expect(entry.getByText(store.store_name)).toBeVisible();
  }

  async then_list_entry_shows_address(store: StoreTestData, position: number): Promise<void> {
    const entry = this.page.getByTestId('store-list-entry').nth(position - 1);
    await expect(entry.getByText(store.address_line_one)).toBeVisible();
    await expect(entry.getByText(store.city)).toBeVisible();
  }

  async then_list_entry_shows_contact(store: StoreTestData, position: number): Promise<void> {
    const entry = this.page.getByTestId('store-list-entry').nth(position - 1);
    await expect(entry.getByText(store.phone_number)).toBeVisible();
    await expect(entry.getByText(store.email_address)).toBeVisible();
  }

  async then_distance_shown(store_name: string, expected_distance_km: number): Promise<void> {
    const row = this.page.getByText(store_name).locator('..');
    await expect(row.getByText(`${expected_distance_km} km`)).toBeVisible();
  }

  async then_sort_position(store_name: string, expected_sort_position: number): Promise<void> {
    const entry = this.page.getByTestId('store-list-entry').nth(expected_sort_position - 1);
    await expect(entry.getByText(store_name)).toBeVisible();
  }

  async then_distances_updated(store_name: string, original_km: number): Promise<void> {
    const row = this.page.getByText(store_name).locator('..');
    await expect(row.getByText(`${original_km} km`)).not.toBeVisible();
  }

  async then_no_distance_displayed(): Promise<void> {
    const count = await this.page.getByTestId('store-list-entry').count();
    for (let i = 0; i < count; i++) {
      await expect(
        this.page.getByTestId('store-list-entry').nth(i).getByTestId('distance'),
      ).not.toBeVisible();
    }
  }

  async then_stores_in_alphabetical_order(): Promise<void> {
    const entries = this.page.getByTestId('store-list-entry');
    const names: string[] = [];
    const count = await entries.count();
    for (let i = 0; i < count; i++) {
      names.push((await entries.nth(i).getByTestId('store-name').textContent()) || '');
    }
    expect(names).toEqual([...names].sort());
  }
}
