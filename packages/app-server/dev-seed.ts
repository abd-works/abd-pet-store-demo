import type { MongoStoreRepository } from '@pawplace/store-server';
import type { MongoProductCatalogRepository } from '@pawplace/product-catalog-server';
import { Store } from '@pawplace/store-shared';

const DEV_STORES = [
  { storeName: 'PawPlace Camden',     storeCode: 'STR-001', addressLineOne: '42 High Street',  city: 'London',     postcode: 'NW1 8QP', latitude: 51.5392,  longitude: -0.1426,  phoneNumber: '020-7946-0001',  emailAddress: 'camden@pawplace.co.uk',     activeStatus: true },
  { storeName: 'PawPlace Bristol',    storeCode: 'STR-002', addressLineOne: '15 Harbour Road',  city: 'Bristol',    postcode: 'BS1 4DJ', latitude: 51.4545,  longitude: -2.5879,  phoneNumber: '0117-496-0002', emailAddress: 'bristol@pawplace.co.uk',    activeStatus: true },
  { storeName: 'PawPlace Manchester', storeCode: 'STR-003', addressLineOne: '8 Deansgate',      city: 'Manchester', postcode: 'M3 2FF',  latitude: 53.4808,  longitude: -2.2426,  phoneNumber: '0161-496-0003', emailAddress: 'manchester@pawplace.co.uk', activeStatus: true },
];

const DEV_PRODUCTS = [
  {
    sku: 'PET-HAR-001', product_name: 'Premium Dog Harness', price: '£34.99', brand: 'PawTech',
    description: 'Adjustable no-pull harness with reflective strips.',
    weight: '0.4kg', length: '30cm', width: '20cm', height: '5cm',
    category: { category_name: 'Harnesses & Leads', parent_category: 'Dog Supplies' },
    images: [{ image_file: 'harness-front.jpg', alt_text: 'Dog harness front view', display_order: 1 }],
  },
  {
    sku: 'PET-FLT-099', product_name: 'Salmon Cat Treats', price: '£6.49', brand: 'WhiskerBites',
    description: 'Grain-free salmon treats for cats.',
    weight: '60g', length: null, width: null, height: null,
    category: { category_name: 'Cat Treats', parent_category: 'Cat Supplies' },
    images: [],
  },
];

const DEV_STOCK = [
  { productSku: 'PET-HAR-001', storeCode: 'STR-001', storeName: 'PawPlace Camden',     quantityOnHand: 25, reservedQuantity: 3, availableToSellQuantity: 22, backorderEnabled: false },
  { productSku: 'PET-HAR-001', storeCode: 'STR-002', storeName: 'PawPlace Bristol',    quantityOnHand: 10, reservedQuantity: 2, availableToSellQuantity: 8,  backorderEnabled: false },
  { productSku: 'PET-FLT-099', storeCode: 'STR-001', storeName: 'PawPlace Camden',     quantityOnHand: 0,  reservedQuantity: 0, availableToSellQuantity: 0,  backorderEnabled: false },
  { productSku: 'PET-FLT-099', storeCode: 'STR-002', storeName: 'PawPlace Bristol',    quantityOnHand: 50, reservedQuantity: 5, availableToSellQuantity: 45, backorderEnabled: false },
];

export function seedDevData(
  storeRepo: MongoStoreRepository,
  productRepo: MongoProductCatalogRepository,
): void {
  for (const s of DEV_STORES) {
    storeRepo.save(Store.fromData({
      storeName: s.storeName, storeCode: s.storeCode,
      addressLineOne: s.addressLineOne, addressLineTwo: '', city: s.city,
      countyOrRegion: '', postcode: s.postcode, country: '',
      latitude: s.latitude, longitude: s.longitude,
      phoneNumber: s.phoneNumber, emailAddress: s.emailAddress, activeStatus: s.activeStatus,
    }));
  }
  for (const p of DEV_PRODUCTS) {
    productRepo.saveProduct(p);
  }
  for (const stock of DEV_STOCK) {
    productRepo.saveStockAvailability(stock);
  }
  console.log(`  Dev data seeded: ${DEV_STORES.length} stores, ${DEV_PRODUCTS.length} products, ${DEV_STOCK.length} stock records`);
}
