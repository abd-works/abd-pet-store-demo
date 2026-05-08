export interface StoreTestData {
  store_name: string;
  store_code: string;
  address_line_one: string;
  city: string;
  postcode: string;
  latitude: number;
  longitude: number;
  phone_number: string;
  email_address: string;
  active_status: boolean;
}

export interface StoreListTestData extends StoreTestData {
  expected_list_position: number;
}

export interface DistanceTestData extends StoreTestData {
  expected_distance_km: number;
  expected_sort_position: number;
}

export abstract class LocateStoresHelper {
  static readonly STORES: readonly StoreTestData[] = [
    {
      store_name: 'PawPlace Camden',
      store_code: 'STR-001',
      address_line_one: '42 High Street',
      city: 'London',
      postcode: 'NW1 8QP',
      latitude: 51.5392,
      longitude: -0.1426,
      phone_number: '020-7946-0001',
      email_address: 'camden@pawplace.co.uk',
      active_status: true,
    },
    {
      store_name: 'PawPlace Bristol',
      store_code: 'STR-002',
      address_line_one: '15 Harbour Road',
      city: 'Bristol',
      postcode: 'BS1 4DJ',
      latitude: 51.4545,
      longitude: -2.5879,
      phone_number: '0117-496-0002',
      email_address: 'bristol@pawplace.co.uk',
      active_status: true,
    },
    {
      store_name: 'PawPlace Manchester',
      store_code: 'STR-003',
      address_line_one: '8 Deansgate',
      city: 'Manchester',
      postcode: 'M3 2FF',
      latitude: 53.4808,
      longitude: -2.2426,
      phone_number: '0161-496-0003',
      email_address: 'manchester@pawplace.co.uk',
      active_status: true,
    },
  ];

  static readonly CUSTOMER_LOCATION = {
    latitude: 51.5074,
    longitude: -0.1278,
  } as const;

  static readonly ALTERNATE_LOCATION = {
    postcode: 'M1 1AA',
    latitude: 53.4794,
    longitude: -2.2453,
  } as const;

  static readonly STORE_LIST_ENTRIES: readonly StoreListTestData[] =
    [...LocateStoresHelper.STORES]
      .sort((a, b) => a.store_name.localeCompare(b.store_name))
      .map((s, i) => ({ ...s, expected_list_position: i + 1 }));

  static readonly STORE_DISTANCES: readonly DistanceTestData[] = [
    { ...LocateStoresHelper.STORES[0], expected_distance_km: 3.7, expected_sort_position: 1 },
    { ...LocateStoresHelper.STORES[2], expected_distance_km: 262.0, expected_sort_position: 3 },
    { ...LocateStoresHelper.STORES[1], expected_distance_km: 170.5, expected_sort_position: 2 },
  ];

  static toStoreObject(data: StoreTestData) {
    return {
      storeName: data.store_name,
      storeCode: data.store_code,
      addressLineOne: data.address_line_one,
      city: data.city,
      postcode: data.postcode,
      latitude: data.latitude,
      longitude: data.longitude,
      phoneNumber: data.phone_number,
      emailAddress: data.email_address,
      activeStatus: data.active_status,
    };
  }

  abstract given_stores_seeded(): Promise<void>;
  abstract cleanup(): Promise<void>;

  given_store_by_code(store_code: string): StoreTestData {
    const store = LocateStoresHelper.STORES.find(s => s.store_code === store_code);
    if (!store) throw new Error(`Store ${store_code} not in test data`);
    return store;
  }
}
