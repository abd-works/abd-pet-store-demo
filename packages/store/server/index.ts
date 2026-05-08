import { InMemoryStoreRepository } from './store.repository';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { createStoreRoutes, createTestRoutes } from './store.routes';

const repository = new InMemoryStoreRepository();
const service = new StoreService(repository);
const controller = new StoreController(service);

export const storeRouter = createStoreRoutes(controller);
export const storeTestRouter = createTestRoutes(controller);
