import type { Db } from 'mongodb';
import { Store, storeSchema } from '@pawplace/store-shared';
import { InMemoryStoreRepository } from './store.repository';

export class MongoStoreRepository extends InMemoryStoreRepository {
  constructor(private readonly db: Db) {
    super();
  }

  async loadFromMongo(): Promise<void> {
    const docs = await this.db.collection('stores').find().toArray();
    for (const doc of docs) {
      const result = storeSchema.safeParse(doc);
      if (!result.success) {
        console.warn('[mongo] Invalid store doc, skipping:', result.error.flatten());
        continue;
      }
      const store = Store.fromData(result.data);
      super.save(store);
    }
  }

  override save(store: Store): void {
    super.save(store);
    const doc = store.toData();
    this.db.collection('stores')
      .replaceOne({ storeCode: store.storeCode }, doc, { upsert: true })
      .catch(err => console.error('[mongo] saveStore error:', err));
  }

  override deleteByCode(storeCode: string): void {
    super.deleteByCode(storeCode);
    this.db.collection('stores')
      .deleteOne({ storeCode })
      .catch(err => console.error('[mongo] deleteStore error:', err));
  }

  override deleteByCodes(codes: string[]): void {
    super.deleteByCodes(codes);
    this.db.collection('stores')
      .deleteMany({ storeCode: { $in: codes } })
      .catch(err => console.error('[mongo] deleteStores error:', err));
  }
}
