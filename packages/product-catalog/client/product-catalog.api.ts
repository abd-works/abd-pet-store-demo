import { productSchema, stockAvailabilitySchema } from '@pawplace/product-catalog-shared';
import { performFetch } from '../../shared/http-io';
import { assertResponseOk, recoverWithMock } from '../../shared/http-client';
import {
  MOCK_PRODUCT_DETAILS,
  MOCK_PRODUCTS,
  MOCK_STOCK_BY_PRODUCT,
  mockStockDetail,
} from './mock-catalog';

const BASE_URL = '';
const readResponseJson = (response: Response): Promise<unknown> => response.json();

export interface ProductSummaryDTO {
  sku: string;
  name: string;
  price: string;
  brand: string;
  category_name: string | null;
  thumbnail: string | null;
}

export interface ProductDetailDTO {
  name: string;
  sku: string;
  price: string;
  brand: string;
  description: string;
  weight: string | null;
  dimensions: { length: string | null; width: string | null; height: string | null } | null;
  images: { imageFile: string; altText: string; displayOrder: number }[];
  breadcrumb: string;
  category: { name: string } | null;
}

export interface StoreStockDTO {
  store_code: string;
  store_name: string;
  stock_label: string;
}

export interface StockDetailDTO {
  productSku: string;
  storeCode: string;
  quantityOnHand: number;
  reservedQuantity: number;
  availableToSellQuantity: number;
}

export interface StockUpdateResultDTO {
  success: boolean;
}

interface ProductListPayload {
  products: unknown[];
}

interface StoreStockPayload {
  stores: unknown[];
}

function mapProductSummary(item: unknown): ProductSummaryDTO {
  const parsed = productSchema.safeParse(item);
  if (!parsed.success) return item as ProductSummaryDTO;
  return {
    sku: parsed.data.sku,
    name: parsed.data.name,
    price: String(parsed.data.price),
    brand: parsed.data.brand,
    category_name: parsed.data.categories[0]?.categoryName ?? null,
    thumbnail: parsed.data.images[0]?.imageFile ?? null,
  };
}

function parseProductList(payload: ProductListPayload): ProductSummaryDTO[] {
  return payload.products.map(mapProductSummary);
}

function productListUrl(category?: string): string {
  const params = category ? `?category=${encodeURIComponent(category)}` : '';
  return `${BASE_URL}/api/products${params}`;
}

function loadProductList(category?: string): Promise<ProductSummaryDTO[]> {
  return performFetch(productListUrl(category))
    .then((response) => {
      assertResponseOk(response, 'products');
      return readResponseJson(response);
    })
    .then((raw) => parseProductList(raw as ProductListPayload));
}

function mockProductsForCategory(category?: string): ProductSummaryDTO[] {
  if (!category) return MOCK_PRODUCTS;
  return MOCK_PRODUCTS.filter((product) => product.category_name === category);
}

export function fetchProducts(category?: string): Promise<ProductSummaryDTO[]> {
  return loadProductList(category).catch((error) =>
    recoverWithMock('product-catalog.api', error, mockProductsForCategory(category)),
  );
}

function loadProductDetail(sku: string): Promise<ProductDetailDTO> {
  return performFetch(`${BASE_URL}/api/products/${sku}`)
    .then((response) => {
      assertResponseOk(response, 'product');
      return readResponseJson(response);
    })
    .then((raw) => raw as ProductDetailDTO);
}

export function fetchProductBySku(sku: string): Promise<ProductDetailDTO> {
  return loadProductDetail(sku).catch((error) => {
    const detail = MOCK_PRODUCT_DETAILS[sku];
    if (!detail) throw error;
    return recoverWithMock('product-catalog.api', error, detail);
  });
}

function parseStoreStockRows(productSku: string, payload: StoreStockPayload): StoreStockDTO[] {
  return payload.stores.map((row) => {
    stockAvailabilitySchema.safeParse({
      productSku,
      storeCode: (row as StoreStockDTO).store_code,
      quantityOnHand: 0,
      availableToSellQuantity: 0,
      stockLevel: 0,
    });
    return row as StoreStockDTO;
  });
}

function loadStoreStock(productSku: string): Promise<StoreStockDTO[]> {
  return performFetch(`${BASE_URL}/api/products/${productSku}/stock`)
    .then((response) => {
      assertResponseOk(response, 'stock');
      return readResponseJson(response);
    })
    .then((raw) => parseStoreStockRows(productSku, raw as StoreStockPayload));
}

export function fetchStockAvailability(productSku: string): Promise<StoreStockDTO[]> {
  return loadStoreStock(productSku).catch((error) =>
    recoverWithMock('product-catalog.api', error, MOCK_STOCK_BY_PRODUCT[productSku] ?? []),
  );
}

function parseStockDetail(productSku: string, storeCode: string, raw: unknown): StockDetailDTO {
  return { productSku, storeCode, ...(raw as Record<string, unknown>) } as StockDetailDTO;
}

function warnInvalidStockDetail(detail: StockDetailDTO): void {
  const result = stockAvailabilitySchema.safeParse(detail);
  if (!result.success) console.warn('[api] Stock data failed validation:', result.error.flatten());
}

function loadStockDetail(productSku: string, storeCode: string): Promise<StockDetailDTO> {
  return performFetch(`${BASE_URL}/api/stock/${productSku}/${storeCode}`)
    .then((response) => {
      assertResponseOk(response, 'stock detail');
      return readResponseJson(response);
    })
    .then((raw) => {
      const detail = parseStockDetail(productSku, storeCode, raw);
      warnInvalidStockDetail(detail);
      return detail;
    });
}

export function getStockAvailability(productSku: string, storeCode: string): Promise<StockDetailDTO> {
  return loadStockDetail(productSku, storeCode).catch((error) => {
    const mock = mockStockDetail(productSku, storeCode);
    if (!mock) throw error;
    return recoverWithMock('product-catalog.api', error, mock);
  });
}

export function updateStockQuantity(
  productSku: string,
  storeCode: string,
  quantityOnHand: number,
): Promise<StockUpdateResultDTO> {
  if (quantityOnHand < 0) {
    throw new Error('stock level must be zero or greater');
  }

  return performFetch(`${BASE_URL}/api/stock/${productSku}/${storeCode}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity_on_hand: quantityOnHand }),
  })
    .then(async (response) => {
      if (!response.ok) {
        const body = await readResponseJson(response).catch((parseError) => {
          recoverWithMock('product-catalog.api', parseError, {});
          return {};
        });
        throw new Error((body as { error?: string }).error ?? `Failed to update stock: ${response.status}`);
      }
      return { success: true };
    })
    .catch((error) => {
      if (error instanceof Error && error.message.includes('stock level')) throw error;
      const mock = mockStockDetail(productSku, storeCode);
      if (!mock) throw error;
      return recoverWithMock('product-catalog.api', error, { success: true });
    });
}
