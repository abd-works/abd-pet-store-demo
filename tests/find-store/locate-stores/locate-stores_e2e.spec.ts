import { test, expect } from '@playwright/test';
import { LocateStoresE2EHelper } from './helpers/locate-stores.e2e';
import {
  LocateStoresHelper,
  StoreTestData,
  DistanceTestData,
} from './helpers/locate-stores.base';

// ============================================================================
// STORY: View Store Map
// ============================================================================

class TestViewStoreMap {
  constructor(private helper: LocateStoresE2EHelper) {}

  /**
   * SCENARIO: Store appears on map with full contact details
   * GIVEN: StoreLocator has Store at coordinates with address and contact
   * WHEN: visitor opens Map View, then selects store
   * THEN: map point visible; detail panel shows address and contact
   */
  async store_appears_on_map(store: StoreTestData) {
    // When
    await this.helper.when_visitor_opens_map_view();
    // Then
    await this.helper.then_map_point_visible(store);
    // When
    await this.helper.when_visitor_selects_store(store.store_name);
    // Then
    await this.helper.then_detail_shows_address(store);
    await this.helper.then_detail_shows_contact(store);
  }
}

// ============================================================================
// STORY: View Store List
// ============================================================================

class TestViewStoreList {
  constructor(private helper: LocateStoresE2EHelper) {}

  /**
   * SCENARIO: Store listed with address and contact details
   * GIVEN: StoreLocator has Store with storeCode
   * WHEN: visitor opens the StoreLocator List View
   * THEN: Store at expected position with address and contact
   */
  async store_listed_with_details(store: StoreTestData, expected_list_position: number) {
    // When
    await this.helper.when_visitor_opens_list_view();
    // Then
    await this.helper.then_store_at_list_position(store, expected_list_position);
    await this.helper.then_list_entry_shows_address(store, expected_list_position);
    await this.helper.then_list_entry_shows_contact(store, expected_list_position);
  }
}

// ============================================================================
// STORY: Calculate Distance to Store
// ============================================================================

class TestCalculateDistanceToStore {
  constructor(private helper: LocateStoresE2EHelper) {}

  /**
   * SCENARIO: Each store shows calculated distance and sort position
   * GIVEN: StoreLocator has Store at coordinates; customer at shared location
   * WHEN: customer shares location
   * THEN: Store shows expected distance and sort position
   */
  async store_shows_distance_and_sort_position(data: DistanceTestData) {
    // When
    await this.helper.when_visitor_opens_list_view();
    await this.helper.when_customer_shares_location();
    // Then
    await this.helper.then_distance_shown(data.store_name, data.expected_distance_km);
    await this.helper.then_sort_position(data.store_name, data.expected_sort_position);
  }

  /**
   * SCENARIO: Distance recalculates when customer changes location
   * GIVEN: customer at shared location; Store showing initial distance
   * WHEN: customer enters postcode M1 1AA
   * THEN: distances recalculated; sort order updates
   */
  async distance_recalculates_on_location_change(data: DistanceTestData) {
    // Given
    await this.helper.when_visitor_opens_list_view();
    await this.helper.when_customer_shares_location();
    // When
    await this.helper.when_customer_enters_postcode(
      LocateStoresHelper.ALTERNATE_LOCATION.postcode,
    );
    // Then
    await this.helper.then_distances_updated(data.store_name, data.expected_distance_km);
  }

  /**
   * SCENARIO: No distance when no location provided
   * GIVEN: StoreLocator contains 3 active Store entries; no customer location
   * WHEN: visitor opens the StoreLocator
   * THEN: stores displayed without distance; alphabetical order
   */
  async no_distance_without_location() {
    // When
    await this.helper.when_visitor_opens_store_locator();
    // Then
    await this.helper.then_no_distance_displayed();
    await this.helper.then_stores_in_alphabetical_order();
  }
}

// ============================================================================
// TEST WIRING
// ============================================================================

test.describe('Locate Stores', () => {
  let helper: LocateStoresE2EHelper;

  test.beforeEach(async ({ page }) => {
    helper = new LocateStoresE2EHelper(page);
    await helper.given_stores_seeded();
  });

  test.afterEach(async () => {
    await helper.cleanup();
  });

  test.describe('View Store Map', () => {
    for (const store of LocateStoresHelper.STORES) {
      test(`store appears on map with full contact details - ${store.store_name}`, async () => {
        const tests = new TestViewStoreMap(helper);
        await tests.store_appears_on_map(store);
      });
    }
  });

  test.describe('View Store List', () => {
    for (const [i, store] of LocateStoresHelper.STORES.entries()) {
      test(`store listed with address and contact details - ${store.store_name}`, async () => {
        const tests = new TestViewStoreList(helper);
        await tests.store_listed_with_details(store, i + 1);
      });
    }
  });

  test.describe('Calculate Distance to Store', () => {
    for (const data of LocateStoresHelper.STORE_DISTANCES) {
      test(`store shows calculated distance and sort position - ${data.store_name}`, async () => {
        const tests = new TestCalculateDistanceToStore(helper);
        await tests.store_shows_distance_and_sort_position(data);
      });
    }

    for (const data of LocateStoresHelper.STORE_DISTANCES) {
      test(`distance recalculates when customer changes location - ${data.store_name}`, async () => {
        const tests = new TestCalculateDistanceToStore(helper);
        await tests.distance_recalculates_on_location_change(data);
      });
    }

    test('no distance when no location provided', async () => {
      const tests = new TestCalculateDistanceToStore(helper);
      await tests.no_distance_without_location();
    });
  });
});

export { TestViewStoreMap, TestViewStoreList, TestCalculateDistanceToStore };
