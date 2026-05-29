import type { Db } from 'mongodb';
import { MongoStoreRepository } from './store.mongo-repository';
import { InMemoryStoreRepository } from './store.repository';
import { RetailStoreCatalog } from './retail-store-catalog';
import { RetailStoreApi } from './retail-store-api';
import { createStoreRoutes, createTestRoutes } from './store.routes';

export function createStoreModule(db?: Db) {
  const repository = db ? new MongoStoreRepository(db) : new InMemoryStoreRepository();
  const catalog = new RetailStoreCatalog(repository);
  const api = new RetailStoreApi(catalog);
  return {
    repository,
    catalog,
    storeRouter: createStoreRoutes(api),
    storeTestRouter: createTestRoutes(api),
  };
}

export type { StoreRepository } from './store.repository';
export { MongoStoreRepository } from './store.mongo-repository';
