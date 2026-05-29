import { stockAvailabilitySchema } from '../shared/product.schema';

export interface StoredProduct {
  product_name: string;
  sku: string;
  price: string;
  brand: string;
  description: string;
  weight: string | null;
  length: string | null;
  width: string | null;
  height: string | null;
  category: {
    category_name: string;
    parent_category: string;
  } | null;
  images: { image_file: string; alt_text: string; display_order: number }[];
}

export interface StoredStockAvailability {
  productSku: string;
  storeCode: string;
  storeName: string;
  quantityOnHand: number;
  reservedQuantity: number;
  availableToSellQuantity: number;
  backorderEnabled: boolean;
}

function parseStoredStock(stock: StoredStockAvailability): StoredStockAvailability {
  stockAvailabilitySchema.parse({
    productSku: stock.productSku,
    storeCode: stock.storeCode,
    quantityOnHand: stock.quantityOnHand,
    reservedQuantity: stock.reservedQuantity,
    availableToSellQuantity: stock.availableToSellQuantity,
    backorderEnabled: stock.backorderEnabled,
    stockLevel: stock.availableToSellQuantity,
  });
  return stock;
}

export interface ProductCatalogRepository {
  saveProduct(product: StoredProduct): void;
  findProductBySku(sku: string): StoredProduct | undefined;
  findAllProducts(): StoredProduct[];
  deleteProducts(skus: string[]): void;
  saveStockAvailability(stock: StoredStockAvailability): void;
  findStockByProduct(productSku: string): StoredStockAvailability[];
  findStock(productSku: string, storeCode: string): StoredStockAvailability | undefined;
  deleteStockByIds(ids: string[]): void;
  deleteStockByKeys(keys: string[]): void;
}

function stockKey(productSku: string, storeCode: string): string {
  return `${productSku}:${storeCode}`;
}

export class InMemoryProductStorage {
  private products = new Map<string, StoredProduct>();

  saveProduct(product: StoredProduct): void {
    this.products.set(product.sku, product);
  }

  findProductBySku(sku: string): StoredProduct | undefined {
    return this.products.get(sku);
  }

  findAllProducts(): StoredProduct[] {
    return [...this.products.values()];
  }

  deleteProducts(skus: string[]): void {
    for (const sku of skus) this.products.delete(sku);
  }
}

export class InMemoryStockStorage {
  private stockByKey = new Map<string, StoredStockAvailability>();

  saveStockAvailability(stock: StoredStockAvailability): void {
    const validated = parseStoredStock(stock);
    this.stockByKey.set(stockKey(validated.productSku, validated.storeCode), validated);
  }

  findStockByProduct(productSku: string): StoredStockAvailability[] {
    const results: StoredStockAvailability[] = [];
    for (const stock of this.stockByKey.values()) {
      if (stock.productSku === productSku) results.push(stock);
    }
    return results;
  }

  findStock(productSku: string, storeCode: string): StoredStockAvailability | undefined {
    return this.stockByKey.get(stockKey(productSku, storeCode));
  }

  deleteStockByIds(ids: string[]): void {
    for (const id of ids) this.stockByKey.delete(id);
  }

  deleteStockByKeys(keys: string[]): void {
    for (const key of keys) this.stockByKey.delete(key);
  }
}

export class InMemoryProductCatalogRepository implements ProductCatalogRepository {
  constructor(
    private readonly products: InMemoryProductStorage,
    private readonly stock: InMemoryStockStorage,
  ) {}

  saveProduct(product: StoredProduct): void { this.products.saveProduct(product); }
  findProductBySku(sku: string): StoredProduct | undefined { return this.products.findProductBySku(sku); }
  findAllProducts(): StoredProduct[] { return this.products.findAllProducts(); }
  deleteProducts(skus: string[]): void { this.products.deleteProducts(skus); }
  saveStockAvailability(row: StoredStockAvailability): void { this.stock.saveStockAvailability(row); }
  findStockByProduct(productSku: string): StoredStockAvailability[] { return this.stock.findStockByProduct(productSku); }
  findStock(productSku: string, storeCode: string): StoredStockAvailability | undefined {
    return this.stock.findStock(productSku, storeCode);
  }
  deleteStockByIds(ids: string[]): void { this.stock.deleteStockByIds(ids); }
  deleteStockByKeys(keys: string[]): void { this.stock.deleteStockByKeys(keys); }
}
