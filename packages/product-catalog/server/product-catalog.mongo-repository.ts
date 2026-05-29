import type { Db } from 'mongodb';
import { stockAvailabilitySchema } from '../shared/product.schema';
import {
  InMemoryProductCatalogRepository,
  InMemoryProductStorage,
  InMemoryStockStorage,
  type StoredProduct,
  type StoredStockAvailability,
} from './product-catalog.repository';

export class MongoProductCatalogRepository extends InMemoryProductCatalogRepository {
  constructor(
    private readonly db: Db,
    products: InMemoryProductStorage,
    stock: InMemoryStockStorage,
  ) {
    super(products, stock);
  }

  async loadFromMongo(): Promise<void> {
    const products = await this.db.collection<StoredProduct>('products').find().toArray();
    for (const product of products) super.saveProduct(product);

    const stockRows = await this.db.collection('stock').find().toArray();
    for (const stockRow of stockRows) {
      const validated = stockAvailabilitySchema.parse(stockRow);
      super.saveStockAvailability(validated as StoredStockAvailability);
    }
  }

  override saveProduct(product: StoredProduct): void {
    super.saveProduct(product);
    this.db.collection('products')
      .replaceOne({ sku: product.sku }, product, { upsert: true })
      .catch((error) => console.error('[mongo] saveProduct error:', error));
  }

  override deleteProducts(skus: string[]): void {
    super.deleteProducts(skus);
    this.db.collection('products')
      .deleteMany({ sku: { $in: skus } })
      .catch((error) => console.error('[mongo] deleteProducts error:', error));
  }

  override saveStockAvailability(stock: StoredStockAvailability): void {
    super.saveStockAvailability(stock);
    this.db.collection('stock')
      .replaceOne({ productSku: stock.productSku, storeCode: stock.storeCode }, stock, { upsert: true })
      .catch((error) => console.error('[mongo] saveStock error:', error));
  }

  override deleteStockByIds(ids: string[]): void {
    super.deleteStockByIds(ids);
    for (const id of ids) {
      const [productSku, storeCode] = id.split(':');
      this.db.collection('stock')
        .deleteOne({ productSku, storeCode })
        .catch((error) => console.error('[mongo] deleteStockById error:', error));
    }
  }

  override deleteStockByKeys(keys: string[]): void {
    super.deleteStockByKeys(keys);
    for (const key of keys) {
      const [productSku, storeCode] = key.split(':');
      this.db.collection('stock')
        .deleteOne({ productSku, storeCode })
        .catch((error) => console.error('[mongo] deleteStockByKey error:', error));
    }
  }
}
