import { StockAvailability, walkInAvailabilityLabel } from '../shared/StockAvailability';
import { refreshStockFromEmployeeEdit } from '../shared/stockAvailabilityReservation';
import type { StoredStockAvailability } from './product-catalog.repository';

export interface StoreStockResponse {
  store_code: string;
  store_name: string;
  stock_label: string;
}

export interface StockDetailResponse {
  quantityOnHand: number;
  reservedQuantity: number;
  availableToSellQuantity: number;
}

export interface StockUpdateResponse {
  quantityOnHand: number;
  availableToSellQuantity: number;
}

function toStoreStock(stock: StoredStockAvailability): StoreStockResponse {
  const entity = new StockAvailability(stock.productSku, stock.storeCode, stock.quantityOnHand, stock.reservedQuantity);
  entity.backorderEnabled = stock.backorderEnabled;
  return {
    store_code: stock.storeCode,
    store_name: stock.storeName,
    stock_label: walkInAvailabilityLabel(entity),
  };
}

function applyStockUpdate(
  stock: StockStorageReaderWriter,
  productSku: string,
  storeCode: string,
  newQuantityOnHand: number,
): StockUpdateResponse {
  const row = stock.findStock(productSku, storeCode);
  if (!row) throw new Error(`Stock not found: ${productSku}:${storeCode}`);

  const entity = new StockAvailability(productSku, storeCode, row.quantityOnHand, row.reservedQuantity);
  entity.backorderEnabled = row.backorderEnabled;
  refreshStockFromEmployeeEdit(entity, newQuantityOnHand);

  row.quantityOnHand = entity.quantityOnHand;
  row.availableToSellQuantity = entity.availableToSellQuantity;
  stock.saveStockAvailability(row);

  return {
    quantityOnHand: entity.quantityOnHand,
    availableToSellQuantity: entity.availableToSellQuantity,
  };
}

export class CatalogStockLevels {
  constructor(private readonly stock: StockStorageReaderWriter) {}

  getStockAvailabilityByProduct(productSku: string): StoreStockResponse[] {
    return this.stock.findStockByProduct(productSku).map((row) => toStoreStock(row));
  }

  getStockDetail(productSku: string, storeCode: string): StockDetailResponse | null {
    const stock = this.stock.findStock(productSku, storeCode);
    return stock
      ? {
          quantityOnHand: stock.quantityOnHand,
          reservedQuantity: stock.reservedQuantity,
          availableToSellQuantity: stock.availableToSellQuantity,
        }
      : null;
  }

  updateStockQuantity(
    productSku: string,
    storeCode: string,
    newQuantityOnHand: number,
  ): StockUpdateResponse {
    return applyStockUpdate(this.stock, productSku, storeCode, newQuantityOnHand);
  }

  getMaxAvailableToSell(productSku: string): number {
    return this.stock
      .findStockByProduct(productSku)
      .reduce((max, row) => Math.max(max, row.availableToSellQuantity), 0);
  }
}

export interface StockStorageReaderWriter {
  saveStockAvailability(stock: StoredStockAvailability): void;
  findStockByProduct(productSku: string): StoredStockAvailability[];
  findStock(productSku: string, storeCode: string): StoredStockAvailability | undefined;
}
