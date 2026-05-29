import type { StockStorageReader, StockStorageWriter } from './catalog-fixture-loader';

export function seedStockAvailabilityFromBatch(
  stock: StockStorageWriter & StockStorageReader,
  data: {
    stock_availability: {
      product_sku: string; store_code: string; store_name: string;
      quantity_on_hand: number; reserved_quantity: number;
      available_to_sell_quantity: number; backorder_enabled: boolean;
    }[];
    stock_updates?: {
      product_sku: string; store_code: string;
      original_quantity_on_hand: number; reserved_quantity: number;
      new_quantity_on_hand: number; expected_available_to_sell: number;
    }[];
  },
): string[] {
  const ids: string[] = [];
  for (const row of data.stock_availability) {
    const key = `${row.product_sku}:${row.store_code}`;
    stock.saveStockAvailability({
      productSku: row.product_sku,
      storeCode: row.store_code,
      storeName: row.store_name,
      quantityOnHand: row.quantity_on_hand,
      reservedQuantity: row.reserved_quantity,
      availableToSellQuantity: row.available_to_sell_quantity,
      backorderEnabled: row.backorder_enabled,
    });
    ids.push(key);
  }
  if (data.stock_updates) {
    for (const update of data.stock_updates) {
      const key = `${update.product_sku}:${update.store_code}`;
      const exists = stock.findStock(update.product_sku, update.store_code);
      if (!exists) {
        stock.saveStockAvailability({
          productSku: update.product_sku,
          storeCode: update.store_code,
          storeName: '',
          quantityOnHand: update.original_quantity_on_hand,
          reservedQuantity: update.reserved_quantity,
          availableToSellQuantity: update.original_quantity_on_hand - update.reserved_quantity,
          backorderEnabled: false,
        });
        if (!ids.includes(key)) ids.push(key);
      }
    }
  }
  return ids;
}
