import express from 'express';
import type { Db } from 'mongodb';
import { createStoreModule } from '@pawplace/store-server';
import { createProductCatalogModule } from '@pawplace/product-catalog-server';

export function createApp(db: Db) {
  const app = express();
  app.use(express.json());

  const { storeRouter, storeTestRouter, repository: storeRepo } = createStoreModule(db);
  const { productCatalogRouter, repository: productRepo } = createProductCatalogModule(db);

  app.use('/api', storeRouter);
  app.use('/api', storeTestRouter);
  app.use(productCatalogRouter);

  return { app, storeRepo, productRepo };
}
