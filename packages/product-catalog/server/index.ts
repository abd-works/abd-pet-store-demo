import type { Db } from 'mongodb';
import { InMemoryProductCatalogRepository } from './product-catalog.repository';
import { MongoProductCatalogRepository } from './product-catalog.mongo-repository';
import { ProductCatalogService } from './product-catalog.service';
import { ProductCatalogController } from './product-catalog.controller';
import { createProductCatalogRouter } from './product-catalog.routes';

export function createProductCatalogModule(db?: Db) {
  const repository = db ? new MongoProductCatalogRepository(db) : new InMemoryProductCatalogRepository();
  const service = new ProductCatalogService(repository);
  const controller = new ProductCatalogController(service);
  return {
    repository,
    productCatalogRouter: createProductCatalogRouter(controller),
  };
}

export { MongoProductCatalogRepository } from './product-catalog.mongo-repository';
export type { ProductCatalogRepository } from './product-catalog.repository';
