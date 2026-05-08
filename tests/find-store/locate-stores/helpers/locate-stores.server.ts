import request from 'supertest';
import assert from 'node:assert/strict';
import { app } from '@pawplace/app-server';
import { LocateStoresHelper, StoreTestData } from './locate-stores.base';

export class LocateStoresServerHelper extends LocateStoresHelper {
  private createdStoreCodes: string[] = [];

  async given_stores_seeded(): Promise<void> {
    for (const store of LocateStoresHelper.STORES) {
      await request(app)
        .post('/api/test/stores')
        .send(LocateStoresHelper.toStoreObject(store));
      this.createdStoreCodes.push(store.store_code);
    }
  }

  async cleanup(): Promise<void> {
    if (this.createdStoreCodes.length === 0) return;
    await request(app)
      .delete('/api/test/stores')
      .send({ codes: this.createdStoreCodes });
    this.createdStoreCodes = [];
  }

  async when_visitor_opens_map_view() {
    return request(app).get('/api/stores').expect(200);
  }

  async when_visitor_selects_store(store_code: string) {
    return request(app).get(`/api/stores/${store_code}`).expect(200);
  }

  async when_visitor_opens_list_view() {
    return request(app).get('/api/stores/list').expect(200);
  }

  async when_calculate_distance_from_customer(
    store_code: string,
    customerLatitude: number,
    customerLongitude: number,
  ) {
    return request(app)
      .get(`/api/stores/${store_code}/distance`)
      .query({ customerLatitude, customerLongitude })
      .expect(200);
  }

  async when_sort_nearest_first(customerLatitude: number, customerLongitude: number) {
    return request(app)
      .get('/api/stores')
      .query({ customerLatitude, customerLongitude, sort: 'nearest' })
      .expect(200);
  }

  async when_visitor_opens_store_locator() {
    return request(app).get('/api/stores').expect(200);
  }

  then_map_point_visible(response: request.Response, store: StoreTestData): void {
    const found = response.body.stores.find(
      (s: any) => s.storeCode === store.store_code,
    );
    assert.ok(found, `${store.store_name} not in map view`);
    assert.strictEqual(found.latitude, store.latitude);
    assert.strictEqual(found.longitude, store.longitude);
  }

  then_detail_shows_address(response: request.Response, store: StoreTestData): void {
    assert.strictEqual(response.body.addressLineOne, store.address_line_one);
    assert.strictEqual(response.body.city, store.city);
    assert.strictEqual(response.body.postcode, store.postcode);
  }

  then_detail_shows_contact(response: request.Response, store: StoreTestData): void {
    assert.strictEqual(response.body.phoneNumber, store.phone_number);
    assert.strictEqual(response.body.emailAddress, store.email_address);
  }

  then_store_at_list_position(
    response: request.Response,
    store: StoreTestData,
    expected_list_position: number,
  ): void {
    const entry = response.body.stores[expected_list_position - 1];
    assert.strictEqual(entry.storeCode, store.store_code);
  }

  then_list_entry_shows_address(
    response: request.Response,
    store: StoreTestData,
    position: number,
  ): void {
    const entry = response.body.stores[position - 1];
    assert.strictEqual(entry.addressLineOne, store.address_line_one);
    assert.strictEqual(entry.city, store.city);
    assert.strictEqual(entry.postcode, store.postcode);
  }

  then_list_entry_shows_contact(
    response: request.Response,
    store: StoreTestData,
    position: number,
  ): void {
    const entry = response.body.stores[position - 1];
    assert.strictEqual(entry.phoneNumber, store.phone_number);
    assert.strictEqual(entry.emailAddress, store.email_address);
  }

  then_distance_shown(response: request.Response, expected_distance_km: number): void {
    assert.strictEqual(response.body.distance_km, expected_distance_km);
  }

  then_sort_position(
    response: request.Response,
    store_code: string,
    expected_sort_position: number,
  ): void {
    const index = response.body.stores.findIndex(
      (s: any) => s.storeCode === store_code,
    );
    assert.strictEqual(index + 1, expected_sort_position);
  }

  then_distance_changed(
    response: request.Response,
    store_code: string,
    original_distance_km: number,
  ): void {
    const found = response.body.stores.find(
      (s: any) => s.storeCode === store_code,
    );
    assert.notStrictEqual(found.distance_km, original_distance_km);
  }

  then_sort_order_updated(response: request.Response): void {
    const stores = response.body.stores;
    for (let i = 1; i < stores.length; i++) {
      assert.ok(stores[i - 1].distance_km <= stores[i].distance_km);
    }
  }

  then_no_distance_displayed(response: request.Response): void {
    for (const store of response.body.stores) {
      assert.strictEqual(store.distance_km, undefined);
    }
  }

  then_stores_in_alphabetical_order(response: request.Response): void {
    const names = response.body.stores.map((s: any) => s.storeName);
    const sorted = [...names].sort();
    assert.deepStrictEqual(names, sorted);
  }
}
