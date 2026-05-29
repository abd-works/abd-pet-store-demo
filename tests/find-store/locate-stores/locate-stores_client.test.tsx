import { describe, it, beforeEach, afterEach, vi } from 'vitest';

vi.mock('@pawplace/store-client/store.api');

import { LocateStoresClientHelper } from './helpers/locate-stores.client';
import {
  LocateStoresHelper,
  StoreTestData,
  StoreListTestData,
  DistanceTestData,
} from './helpers/locate-stores.base';

// ============================================================================
// STORY: View Store Map
// ============================================================================

class TestViewStoreMap {
  constructor(private helper: LocateStoresClientHelper) {}

  /**
   * SCENARIO: Store appears on map with full contact details
   * GIVEN: StoreLocator has Store at coordinates with address and contact
   * WHEN: visitor opens Map View, then selects store point
   * THEN: map point visible; detail panel shows address and contact
   */
  async store_appears_on_map(store: StoreTestData) {
    await this.helper.when_visitor_opens_map_view();
    this.helper.then_map_point_visible(store);
    await this.helper.when_visitor_selects_store(store.store_name);
    this.helper.then_detail_shows_address(store);
    this.helper.then_detail_shows_contact(store);
  }

  /**
   * SCENARIO: All stores shown simultaneously without search
   * GIVEN: StoreLocator contains 3 active Store entries
   * WHEN: visitor opens the StoreLocator map view
   * THEN: all 3 Store locations are visible simultaneously
   */
  async all_stores_visible_on_map_without_search() {
    await this.helper.when_visitor_opens_map_view();
    this.helper.then_all_stores_visible_on_map(3);
  }
}

// ============================================================================
// STORY: View Store List
// ============================================================================

class TestViewStoreList {
  constructor(private helper: LocateStoresClientHelper) {}

  /**
   * SCENARIO: Store listed with address and contact details
   * GIVEN: StoreLocator has Store with storeCode
   * WHEN: visitor opens the StoreLocator List View
   * THEN: Store at expected position with address and contact
   */
  async store_listed_with_details(data: StoreListTestData) {
    await this.helper.when_visitor_opens_list_view();
    this.helper.then_store_at_list_position(data, data.expected_list_position);
    this.helper.then_list_entry_shows_address(data, data.expected_list_position);
    await this.helper.when_visitor_selects_store(data.store_name);
    this.helper.then_detail_shows_address(data);
    this.helper.then_detail_shows_contact(data);
  }

  /**
   * SCENARIO: All stores appear without search or filtering
   * GIVEN: StoreLocator contains 3 active Store entries
   * WHEN: visitor opens the StoreLocator list view
   * THEN: all 3 Store entries are visible
   */
  async all_stores_appear_without_search_or_filtering() {
    await this.helper.when_visitor_opens_list_view();
    this.helper.then_all_stores_visible_in_list(3);
  }
}

// ============================================================================
// STORY: Calculate Distance to Store
// ============================================================================

class TestCalculateDistanceToStore {
  constructor(private helper: LocateStoresClientHelper) {}

  /**
   * SCENARIO: Each store shows calculated distance and sort position
   * GIVEN: StoreLocator has Store at coordinates; customer at shared location
   * WHEN: customer location applied and list view opens
   * THEN: Store shows expected distance and sort position
   */
  async store_shows_distance_and_sort_position(data: DistanceTestData) {
    // Given
    const { latitude, longitude } = LocateStoresHelper.CUSTOMER_LOCATION;
    this.helper.given_customer_at_location(latitude, longitude);
    // When
    await this.helper.when_visitor_opens_list_after_shared_location(latitude, longitude);
    // Then
    this.helper.then_distance_shown(data.store_name, data.expected_distance_km);
    this.helper.then_sort_position(data.store_name, data.expected_sort_position);
  }

  /**
   * SCENARIO: Distance recalculates when customer changes location
   * GIVEN: customer at shared location; Store showing initial distance
   * WHEN: customer enters postcode M1 1AA
   * THEN: distances recalculated; sort order updates
   */
  async distance_recalculates_on_location_change(data: DistanceTestData) {
    // Given
    const { latitude, longitude } = LocateStoresHelper.CUSTOMER_LOCATION;
    this.helper.given_customer_at_location(latitude, longitude);
    await this.helper.when_visitor_opens_list_after_shared_location(latitude, longitude);
    // When
    this.helper.given_customer_at_alternate_location();
    await this.helper.when_customer_enters_postcode(
      LocateStoresHelper.ALTERNATE_LOCATION.postcode,
    );
    // Then
    await this.helper.then_distances_recalculated(
      data.store_name,
      data.expected_distance_km,
    );
  }

  /**
   * SCENARIO: No distance when no location provided
   * GIVEN: StoreLocator contains 3 active Store entries; no customer location
   * WHEN: visitor opens the StoreLocator
   * THEN: stores displayed without distance; alphabetical order
   */
  async no_distance_without_location() {
    // When
    await this.helper.when_visitor_opens_list_view();
    // Then
    this.helper.then_no_distance_displayed();
    this.helper.then_stores_in_alphabetical_order();
  }
}

// ============================================================================
// TEST WIRING
// ============================================================================

const helper = new LocateStoresClientHelper();

describe('Locate Stores', () => {
  beforeEach(async () => { await helper.given_stores_seeded(); });
  afterEach(async () => { await helper.cleanup(); });

  describe('View Store Map', () => {
    const tests = new TestViewStoreMap(helper);

    it.each([...LocateStoresHelper.STORES])(
      'store appears on map with full contact details - $store_name',
      async (store) => { await tests.store_appears_on_map(store); },
    );

    it('all stores visible on map without search', async () => {
      await tests.all_stores_visible_on_map_without_search();
    });
  });

  describe('View Store List', () => {
    const tests = new TestViewStoreList(helper);

    it.each([...LocateStoresHelper.STORE_LIST_ENTRIES])(
      'store listed with address and contact details - $store_name',
      async (data) => { await tests.store_listed_with_details(data); },
    );

    it('all stores appear without search or filtering', async () => {
      await tests.all_stores_appear_without_search_or_filtering();
    });
  });

  describe('Calculate Distance to Store', () => {
    const tests = new TestCalculateDistanceToStore(helper);

    it.each([...LocateStoresHelper.STORE_DISTANCES])(
      'store shows calculated distance and sort position - $store_name',
      async (data) => { await tests.store_shows_distance_and_sort_position(data); },
    );

    it.each([...LocateStoresHelper.STORE_DISTANCES])(
      'distance recalculates when customer changes location - $store_name',
      async (data) => { await tests.distance_recalculates_on_location_change(data); },
    );

    it('no distance when no location provided', async () => {
      await tests.no_distance_without_location();
    });
  });
});

export { TestViewStoreMap, TestViewStoreList, TestCalculateDistanceToStore };
