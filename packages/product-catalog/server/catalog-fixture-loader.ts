import type { StoredProduct, StoredStockAvailability } from './product-catalog.repository';
import { seedStockAvailabilityFromBatch } from './catalogFixtureSeed';

export interface ProductStorageWriter {
  saveProduct(product: StoredProduct): void;
  deleteProducts(skus: string[]): void;
}

export interface StockStorageReader {
  findStock(productSku: string, storeCode: string): StoredStockAvailability | undefined;
}

export interface StockStorageWriter {
  saveStockAvailability(stock: StoredStockAvailability): void;
  deleteStockByIds(ids: string[]): void;
  deleteStockByKeys(keys: string[]): void;
}

export class CatalogFixtureLoader {
  constructor(
    private readonly products: ProductStorageWriter,
    private readonly stock: StockStorageWriter & StockStorageReader,
  ) {}

  seedProduct(data: {
    product_name: string; sku: string; price: string; brand: string;
    description: string; weight: string | null;
    length: string | null; width: string | null; height: string | null;
    category?: { category_name: string; parent_category: string } | null;
    images?: { image_file: string; alt_text: string; display_order: number }[];
  }): void {
    this.products.saveProduct({
      product_name: data.product_name,
      sku: data.sku,
      price: data.price,
      brand: data.brand,
      description: data.description,
      weight: data.weight,
      length: data.length,
      width: data.width,
      height: data.height,
      category: data.category
        ? { category_name: data.category.category_name, parent_category: data.category.parent_category }
        : null,
      images: data.images?.map((image) => ({
        image_file: image.image_file,
        alt_text: image.alt_text,
        display_order: image.display_order,
      })) ?? [],
    });
  }

  deleteProducts(skus: string[]): void {
    this.products.deleteProducts(skus);
  }

  seedStockAvailabilityBatch(data: Parameters<typeof seedStockAvailabilityFromBatch>[1]): string[] {
    return seedStockAvailabilityFromBatch(this.stock, data);
  }

  deleteStockAvailability(ids: string[]): void {
    this.stock.deleteStockByIds(ids);
  }

  seedStock(data: {
    product_sku: string; product_name: string;
    store_code: string; store_name: string;
    quantity_on_hand: number; reserved_quantity: number;
  }): void {
    this.stock.saveStockAvailability({
      productSku: data.product_sku,
      storeCode: data.store_code,
      storeName: data.store_name,
      quantityOnHand: data.quantity_on_hand,
      reservedQuantity: data.reserved_quantity,
      availableToSellQuantity: data.quantity_on_hand - data.reserved_quantity,
      backorderEnabled: false,
    });
  }

  deleteStockByKeys(keys: string[]): void {
    this.stock.deleteStockByKeys(keys);
  }
}
