import { StockAvailability, NegativeQuantityError } from '../shared/StockAvailability';
import type { ProductCatalogRepository, StoredProduct, StoredStockAvailability } from './product-catalog.repository';

export interface ProductDetailResponse {
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

export interface StoreStockResponse {
  store_code: string;
  store_name: string;
  available_to_sell_quantity: number;
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

export class ProductCatalogService {
  constructor(private readonly repository: ProductCatalogRepository) {}

  getProductBySku(sku: string): ProductDetailResponse | null {
    const product = this.repository.findProductBySku(sku);
    if (!product) return null;
    return this.toProductDetail(product);
  }

  getStockAvailabilityByProduct(productSku: string): StoreStockResponse[] {
    const stocks = this.repository.findStockByProduct(productSku);
    return stocks.map(s => this.toStoreStock(s));
  }

  getStockDetail(productSku: string, storeCode: string): StockDetailResponse | null {
    const stock = this.repository.findStock(productSku, storeCode);
    if (!stock) return null;
    return {
      quantityOnHand: stock.quantityOnHand,
      reservedQuantity: stock.reservedQuantity,
      availableToSellQuantity: stock.availableToSellQuantity,
    };
  }

  updateStockQuantity(productSku: string, storeCode: string, newQuantityOnHand: number): StockUpdateResponse {
    const stock = this.repository.findStock(productSku, storeCode);
    if (!stock) throw new Error(`Stock not found: ${productSku}:${storeCode}`);

    const entity = new StockAvailability(productSku, storeCode, stock.quantityOnHand, stock.reservedQuantity);
    entity.backorderEnabled = stock.backorderEnabled;
    entity.updateQuantityOnHand(newQuantityOnHand);

    stock.quantityOnHand = entity.quantityOnHand;
    stock.availableToSellQuantity = entity.availableToSellQuantity;
    this.repository.saveStockAvailability(stock);

    return {
      quantityOnHand: entity.quantityOnHand,
      availableToSellQuantity: entity.availableToSellQuantity,
    };
  }

  seedProduct(data: {
    product_name: string; sku: string; price: string; brand: string;
    description: string; weight: string | null;
    length: string | null; width: string | null; height: string | null;
    category?: { category_name: string; parent_category: string } | null;
    images?: { image_file: string; alt_text: string; display_order: number }[];
  }): void {
    this.repository.saveProduct({
      product_name: data.product_name,
      sku: data.sku,
      price: data.price,
      brand: data.brand,
      description: data.description,
      weight: data.weight,
      length: data.length,
      width: data.width,
      height: data.height,
      category: data.category ? {
        category_name: data.category.category_name,
        parent_category: data.category.parent_category,
      } : null,
      images: data.images?.map(i => ({
        image_file: i.image_file,
        alt_text: i.alt_text,
        display_order: i.display_order,
      })) ?? [],
    });
  }

  deleteProducts(skus: string[]): void {
    this.repository.deleteProducts(skus);
  }

  seedStockAvailabilityBatch(data: {
    products: { product_name: string; product_sku: string }[];
    stores: { store_code: string; store_name: string }[];
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
  }): string[] {
    const ids: string[] = [];
    for (const sa of data.stock_availability) {
      const key = `${sa.product_sku}:${sa.store_code}`;
      this.repository.saveStockAvailability({
        productSku: sa.product_sku,
        storeCode: sa.store_code,
        storeName: sa.store_name,
        quantityOnHand: sa.quantity_on_hand,
        reservedQuantity: sa.reserved_quantity,
        availableToSellQuantity: sa.available_to_sell_quantity,
        backorderEnabled: sa.backorder_enabled,
      });
      ids.push(key);
    }
    if (data.stock_updates) {
      for (const su of data.stock_updates) {
        const key = `${su.product_sku}:${su.store_code}`;
        if (!this.repository.findStock(su.product_sku, su.store_code)) {
          this.repository.saveStockAvailability({
            productSku: su.product_sku,
            storeCode: su.store_code,
            storeName: '',
            quantityOnHand: su.original_quantity_on_hand,
            reservedQuantity: su.reserved_quantity,
            availableToSellQuantity: su.original_quantity_on_hand - su.reserved_quantity,
            backorderEnabled: false,
          });
          if (!ids.includes(key)) ids.push(key);
        }
      }
    }
    return ids;
  }

  deleteStockAvailability(ids: string[]): void {
    this.repository.deleteStockByIds(ids);
  }

  seedStock(data: {
    product_sku: string; product_name: string;
    store_code: string; store_name: string;
    quantity_on_hand: number; reserved_quantity: number;
  }): void {
    this.repository.saveStockAvailability({
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
    this.repository.deleteStockByKeys(keys);
  }

  private toProductDetail(product: StoredProduct): ProductDetailResponse {
    const hasDimensions = product.length !== null || product.width !== null || product.height !== null;
    return {
      name: product.product_name,
      sku: product.sku,
      price: product.price,
      brand: product.brand,
      description: product.description,
      weight: product.weight,
      dimensions: hasDimensions
        ? { length: product.length, width: product.width, height: product.height }
        : null,
      images: product.images
        .sort((a, b) => a.display_order - b.display_order)
        .map(i => ({ imageFile: i.image_file, altText: i.alt_text, displayOrder: i.display_order })),
      breadcrumb: product.category
        ? `${product.category.parent_category} > ${product.category.category_name}`
        : '',
      category: product.category ? { name: product.category.category_name } : null,
    };
  }

  private toStoreStock(stock: StoredStockAvailability): StoreStockResponse {
    const entity = new StockAvailability(stock.productSku, stock.storeCode, stock.quantityOnHand, stock.reservedQuantity);
    entity.backorderEnabled = stock.backorderEnabled;
    return {
      store_code: stock.storeCode,
      store_name: stock.storeName,
      available_to_sell_quantity: stock.availableToSellQuantity,
      stock_label: entity.stockLabel(),
    };
  }
}
