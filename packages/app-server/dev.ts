import { connectDb } from './db';
import { createApp } from './index';
import { seedDevData } from './dev-seed';
import { MongoStoreRepository } from '@pawplace/store-server';
import { MongoProductCatalogRepository } from '@pawplace/product-catalog-server';

const PORT = 3001;

const db = await connectDb();
const { app, storeRepo, productRepo } = createApp(db);

await (storeRepo as MongoStoreRepository).loadFromMongo();
await (productRepo as MongoProductCatalogRepository).loadFromMongo();

seedDevData(
  storeRepo as MongoStoreRepository,
  productRepo as MongoProductCatalogRepository,
);

app.listen(PORT, () => {
  console.log(`PawPlace API running at http://localhost:${PORT}`);
});
