import type {
  ProductDetailDTO,
  ProductSummaryDTO,
  StockDetailDTO,
  StoreStockDTO,
} from './product-catalog.api';

export const MOCK_PRODUCTS: ProductSummaryDTO[] = [
  {
    sku: 'PET-HAR-001',
    name: 'Premium Dog Harness',
    price: '£34.99',
    brand: 'PawTech',
    category_name: 'Harnesses & Leads',
    thumbnail: null,
  },
  {
    sku: 'PET-FLT-099',
    name: 'Salmon Cat Treats',
    price: '£6.49',
    brand: 'WhiskerBites',
    category_name: 'Cat Treats',
    thumbnail: null,
  },
];

export const MOCK_PRODUCT_DETAILS: Record<string, ProductDetailDTO> = {
  'PET-HAR-001': {
    sku: 'PET-HAR-001',
    name: 'Premium Dog Harness',
    price: '£34.99',
    brand: 'PawTech',
    description: 'Adjustable no-pull harness with reflective strips.',
    weight: '0.4kg',
    dimensions: { length: '30cm', width: '20cm', height: '5cm' },
    images: [
      {
        imageFile: 'https://placehold.co/400x300/e8e8e8/666?text=harness+front',
        altText: 'Dog harness front view',
        displayOrder: 1,
      },
      {
        imageFile: 'https://placehold.co/400x300/d8d8d8/666?text=harness+side',
        altText: 'Dog harness side view',
        displayOrder: 2,
      },
    ],
    breadcrumb: 'product catalog › Premium Dog Harness',
    category: { name: 'Harnesses & Leads' },
  },
  'PET-FLT-099': {
    sku: 'PET-FLT-099',
    name: 'Salmon Cat Treats',
    price: '£6.49',
    brand: 'WhiskerBites',
    description: 'Grain-free salmon treats for cats.',
    weight: '60g',
    dimensions: null,
    images: [],
    breadcrumb: 'product catalog › Salmon Cat Treats',
    category: { name: 'Cat Treats' },
  },
};

export const MOCK_STOCK_BY_PRODUCT: Record<string, StoreStockDTO[]> = {
  'PET-HAR-001': [
    {
      store_code: 'STR-001',
      store_name: 'PawPlace Camden',
      stock_label: 'In stock',
    },
    {
      store_code: 'STR-002',
      store_name: 'PawPlace Bristol',
      stock_label: 'In stock',
    },
  ],
  'PET-FLT-099': [
    {
      store_code: 'STR-001',
      store_name: 'PawPlace Camden',
      stock_label: 'Out of stock',
    },
    {
      store_code: 'STR-002',
      store_name: 'PawPlace Bristol',
      stock_label: 'In stock',
    },
  ],
};

const MOCK_STOCK_QUANTITIES: Record<string, Record<string, { quantityOnHand: number; reservedQuantity: number }>> = {
  'PET-HAR-001': {
    'STR-001': { quantityOnHand: 25, reservedQuantity: 3 },
    'STR-002': { quantityOnHand: 8, reservedQuantity: 0 },
  },
  'PET-FLT-099': {
    'STR-001': { quantityOnHand: 0, reservedQuantity: 0 },
    'STR-002': { quantityOnHand: 45, reservedQuantity: 0 },
  },
};

export function mockStockDetail(productSku: string, storeCode: string): StockDetailDTO | null {
  const quantities = MOCK_STOCK_QUANTITIES[productSku]?.[storeCode];
  if (!quantities) return null;
  return {
    productSku,
    storeCode,
    quantityOnHand: quantities.quantityOnHand,
    reservedQuantity: quantities.reservedQuantity,
    availableToSellQuantity: quantities.quantityOnHand - quantities.reservedQuantity,
  };
}
