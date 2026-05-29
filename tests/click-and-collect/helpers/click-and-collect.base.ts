/**
 * Click-and-collect — base helper (Increment 2)
 *
 * Standard test data from increment-2-specification-by-example.md
 */
export interface ProductTestData {
  product_name: string;
  sku: string;
  price: string;
  brand: string;
  description: string;
}

export interface StockTestData {
  product_sku: string;
  store_code: string;
  store_name: string;
  quantity_on_hand: number;
  reserved_quantity: number;
  available_to_sell_quantity: number;
  backorder_enabled: boolean;
}

export interface StoreTestData {
  store_name: string;
  store_code: string;
  address_line_one: string;
  city: string;
  postcode: string;
  latitude: number;
  longitude: number;
}

export interface GuestCheckoutTestData {
  guest_email: string;
  guest_name: string;
}

export interface BillingAddressTestData {
  name: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  countyOrRegion: string;
  postcode: string;
  country: string;
}

export abstract class ClickAndCollectBase {
  static readonly PRODUCTS: readonly ProductTestData[] = [
    {
      product_name: 'Premium Dog Harness',
      sku: 'PET-HAR-001',
      price: '£34.99',
      brand: 'WalkRight',
      description: 'Adjustable no-pull harness with reflective strips.',
    },
    {
      product_name: 'Salmon Cat Treats',
      sku: 'PET-TRT-042',
      price: '£4.99',
      brand: 'PurrDelight',
      description: 'Grain-free salmon treats for cats.',
    },
    {
      product_name: 'Exotic Fish Filter',
      sku: 'PET-FLT-099',
      price: '£89.99',
      brand: 'AquaPure',
      description: 'Aquarium filter for exotic fish.',
    },
  ] as const;

  static readonly STOCK: readonly StockTestData[] = [
    {
      product_sku: 'PET-HAR-001',
      store_code: 'STR-001',
      store_name: 'PawPlace Camden',
      quantity_on_hand: 25,
      reserved_quantity: 3,
      available_to_sell_quantity: 22,
      backorder_enabled: false,
    },
    {
      product_sku: 'PET-TRT-042',
      store_code: 'STR-001',
      store_name: 'PawPlace Camden',
      quantity_on_hand: 50,
      reserved_quantity: 2,
      available_to_sell_quantity: 48,
      backorder_enabled: false,
    },
    {
      product_sku: 'PET-FLT-099',
      store_code: 'STR-001',
      store_name: 'PawPlace Camden',
      quantity_on_hand: 0,
      reserved_quantity: 0,
      available_to_sell_quantity: 0,
      backorder_enabled: false,
    },
    {
      product_sku: 'PET-FLT-099',
      store_code: 'STR-002',
      store_name: 'PawPlace Bristol',
      quantity_on_hand: 1,
      reserved_quantity: 0,
      available_to_sell_quantity: 0,
      backorder_enabled: false,
    },
  ] as const;

  static readonly STORES: readonly StoreTestData[] = [
    {
      store_name: 'PawPlace Camden',
      store_code: 'STR-001',
      address_line_one: '42 High Street',
      city: 'London',
      postcode: 'NW1 8QP',
      latitude: 51.5392,
      longitude: -0.1426,
    },
    {
      store_name: 'PawPlace Bristol',
      store_code: 'STR-002',
      address_line_one: '15 Harbour Road',
      city: 'Bristol',
      postcode: 'BS1 4DJ',
      latitude: 51.4545,
      longitude: -2.5879,
    },
  ] as const;

  static readonly VALID_GUEST: GuestCheckoutTestData = {
    guest_email: 'sarah.jones@example.com',
    guest_name: 'Sarah Jones',
  };

  static readonly INVALID_GUEST_EMAIL = 'not-an-email';

  static readonly VALID_BILLING: BillingAddressTestData = {
    name: 'Sarah Jones',
    addressLine1: '10 Elm Avenue',
    addressLine2: 'Flat 3',
    city: 'London',
    countyOrRegion: 'Greater London',
    postcode: 'SW1A 2AA',
    country: 'United Kingdom',
  };

  static readonly VALID_CARD = {
    cardNumber: '4242 4242 4242 4242',
    expiry: '12/27',
    cvv: '123',
  };

  static readonly DECLINED_CARD = {
    cardNumber: '4242 4242 4242 0002',
    expiry: '12/27',
    cvv: '123',
  };

  static toStoreSeedBody(store: StoreTestData) {
    return {
      storeName: store.store_name,
      storeCode: store.store_code,
      addressLineOne: store.address_line_one,
      city: store.city,
      postcode: store.postcode,
      latitude: store.latitude,
      longitude: store.longitude,
      phoneNumber: '020-0000-0000',
      emailAddress: 'store@pawplace.co.uk',
      activeStatus: true,
    };
  }

  static toProductSeedBody(product: ProductTestData) {
    return {
      product_name: product.product_name,
      sku: product.sku,
      price: product.price,
      brand: product.brand,
      description: product.description,
      weight: '0.4kg',
      length: null,
      width: null,
      height: null,
      category: { category_name: 'Dog Supplies', parent_category: 'Supplies' },
      images: [],
    };
  }

  abstract seed(): Promise<void>;
  abstract cleanup(): Promise<void>;
}
