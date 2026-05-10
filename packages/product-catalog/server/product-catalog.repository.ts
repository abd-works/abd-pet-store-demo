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

export interface ProductCatalogRepository {
  saveProduct(product: StoredProduct): void;
  findProductBySku(sku: string): StoredProduct | undefined;
  deleteProducts(skus: string[]): void;
  saveStockAvailability(stock: StoredStockAvailability): void;
  findStockByProduct(productSku: string): StoredStockAvailability[];
  findStock(productSku: string, storeCode: string): StoredStockAvailability | undefined;
  deleteStockByIds(ids: string[]): void;
  deleteStockByKeys(keys: string[]): void;
  allStockKeys(): string[];
}

export class InMemoryProductCatalogRepository implements ProductCatalogRepository {
  private products = new Map<string, StoredProduct>();
  private stockByKey = new Map<string, StoredStockAvailability>();

  private stockKey(productSku: string, storeCode: string): string {
    return `${productSku}:${storeCode}`;
  }

  saveProduct(product: StoredProduct): void {
    this.products.set(product.sku, product);
  }

  findProductBySku(sku: string): StoredProduct | undefined {
    return this.products.get(sku);
  }

  deleteProducts(skus: string[]): void {
    for (const sku of skus) this.products.delete(sku);
  }

  saveStockAvailability(stock: StoredStockAvailability): void {
    const key = this.stockKey(stock.productSku, stock.storeCode);
    this.stockByKey.set(key, stock);
  }

  findStockByProduct(productSku: string): StoredStockAvailability[] {
    const results: StoredStockAvailability[] = [];
    for (const stock of this.stockByKey.values()) {
      if (stock.productSku === productSku) results.push(stock);
    }
    return results;
  }

  findStock(productSku: string, storeCode: string): StoredStockAvailability | undefined {
    return this.stockByKey.get(this.stockKey(productSku, storeCode));
  }

  deleteStockByIds(ids: string[]): void {
    for (const id of ids) this.stockByKey.delete(id);
  }

  deleteStockByKeys(keys: string[]): void {
    for (const key of keys) this.stockByKey.delete(key);
  }

  allStockKeys(): string[] {
    return [...this.stockByKey.keys()];
  }
}
