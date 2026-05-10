import type { Db } from 'mongodb';
import { MongoStoreRepository } from './store.mongo-repository';
import { InMemoryStoreRepository } from './store.repository';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { createStoreRoutes, createTestRoutes } from './store.routes';

export function createStoreModule(db?: Db) {
  const repository = db ? new MongoStoreRepository(db) : new InMemoryStoreRepository();
  const service = new StoreService(repository);
  const controller = new StoreController(service);
  return {
    repository,
    storeRouter: createStoreRoutes(controller),
    storeTestRouter: createTestRoutes(controller),
  };
}

export type { StoreRepository } from './store.repository';
export { MongoStoreRepository } from './store.mongo-repository';
