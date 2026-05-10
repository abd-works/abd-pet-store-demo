import type { Db } from 'mongodb';
import { stockAvailabilitySchema } from '@pawplace/product-catalog-shared';
import { InMemoryProductCatalogRepository, type StoredProduct, type StoredStockAvailability } from './product-catalog.repository';

export class MongoProductCatalogRepository extends InMemoryProductCatalogRepository {
  constructor(private readonly db: Db) {
    super();
  }

  async loadFromMongo(): Promise<void> {
    const products = await this.db.collection<StoredProduct>('products').find().toArray();
    for (const p of products) super.saveProduct(p);

    const stock = await this.db.collection('stock').find().toArray();
    for (const s of stock) {
      const result = stockAvailabilitySchema.safeParse(s);
      if (!result.success) {
        console.warn('[mongo] Invalid stock doc, skipping:', result.error.flatten());
        continue;
      }
      super.saveStockAvailability(s as StoredStockAvailability);
    }
  }

  override saveProduct(product: StoredProduct): void {
    super.saveProduct(product);
    this.db.collection('products')
      .replaceOne({ sku: product.sku }, product, { upsert: true })
      .catch(err => console.error('[mongo] saveProduct error:', err));
  }

  override deleteProducts(skus: string[]): void {
    super.deleteProducts(skus);
    this.db.collection('products')
      .deleteMany({ sku: { $in: skus } })
      .catch(err => console.error('[mongo] deleteProducts error:', err));
  }

  override saveStockAvailability(stock: StoredStockAvailability): void {
    super.saveStockAvailability(stock);
    this.db.collection('stock')
      .replaceOne({ productSku: stock.productSku, storeCode: stock.storeCode }, stock, { upsert: true })
      .catch(err => console.error('[mongo] saveStock error:', err));
  }

  override deleteStockByIds(ids: string[]): void {
    super.deleteStockByIds(ids);
    for (const id of ids) {
      const [productSku, storeCode] = id.split(':');
      this.db.collection('stock')
        .deleteOne({ productSku, storeCode })
        .catch(err => console.error('[mongo] deleteStockById error:', err));
    }
  }

  override deleteStockByKeys(keys: string[]): void {
    super.deleteStockByKeys(keys);
    for (const key of keys) {
      const [productSku, storeCode] = key.split(':');
      this.db.collection('stock')
        .deleteOne({ productSku, storeCode })
        .catch(err => console.error('[mongo] deleteStockByKey error:', err));
    }
  }
}
