import type { ProductCatalogRepository } from './product-catalog.repository';

const DEFAULT_LOW_STOCK_THRESHOLD = 5;

export interface InventoryDashboardRow {
  productSku: string;
  storeCode: string;
  storeName: string;
  quantityOnHand: number;
  availableToSellQuantity: number;
  backorderEnabled: boolean;
  lowStock: boolean;
}

export interface InventoryDashboardResult {
  rows: InventoryDashboardRow[];
  lowStockThreshold: number;
}

export class InventoryDashboardService {
  constructor(
    private readonly catalog: ProductCatalogRepository,
    private readonly lowStockThreshold = DEFAULT_LOW_STOCK_THRESHOLD,
  ) {}

  listAll(): InventoryDashboardResult {
    const rows: InventoryDashboardRow[] = [];
    for (const product of this.catalog.findAllProducts()) {
      for (const stock of this.catalog.findStockByProduct(product.sku)) {
        rows.push({
          productSku: stock.productSku,
          storeCode: stock.storeCode,
          storeName: stock.storeName,
          quantityOnHand: stock.quantityOnHand,
          availableToSellQuantity: stock.availableToSellQuantity,
          backorderEnabled: stock.backorderEnabled,
          lowStock: stock.availableToSellQuantity <= this.lowStockThreshold,
        });
      }
    }
    return { rows, lowStockThreshold: this.lowStockThreshold };
  }
}
