import { stockAvailabilitySchema } from '@pawplace/product-catalog-shared';

const BASE_URL = '';

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
  available_to_sell_quantity: number;
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

export async function fetchProductBySku(sku: string): Promise<ProductDetailDTO> {
  const response = await fetch(`${BASE_URL}/api/products/${sku}`);
  if (!response.ok) throw new Error(`Failed to fetch product: ${response.status}`);
  return response.json();
}

export async function fetchStockAvailability(productSku: string): Promise<StoreStockDTO[]> {
  const response = await fetch(`${BASE_URL}/api/products/${productSku}/stock`);
  if (!response.ok) throw new Error(`Failed to fetch stock: ${response.status}`);
  const data = await response.json();
  return data.stores;
}

export async function getStockAvailability(productSku: string, storeCode: string): Promise<StockDetailDTO> {
  const response = await fetch(`${BASE_URL}/api/stock/${productSku}/${storeCode}`);
  if (!response.ok) throw new Error(`Failed to fetch stock detail: ${response.status}`);
  const data = await response.json();
  const raw = { productSku, storeCode, ...data };
  const result = stockAvailabilitySchema.safeParse(raw);
  if (!result.success) console.warn('[api] Stock data failed validation:', result.error.flatten());
  return raw as StockDetailDTO;
}

export async function updateStockQuantity(
  productSku: string, storeCode: string, quantityOnHand: number,
): Promise<StockUpdateResultDTO> {
  const response = await fetch(`${BASE_URL}/api/stock/${productSku}/${storeCode}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity_on_hand: quantityOnHand }),
  });
  if (!response.ok) throw new Error(`Failed to update stock: ${response.status}`);
  return { success: true };
}
