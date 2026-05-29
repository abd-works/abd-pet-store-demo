import type { Db } from 'mongodb';
import {
  InMemoryProductCatalogRepository,
  InMemoryProductStorage,
  InMemoryStockStorage,
} from './product-catalog.repository';
import { MongoProductCatalogRepository } from './product-catalog.mongo-repository';
import { CatalogProductBrowse } from './catalog-product-browse';
import { CatalogStockLevels } from './catalog-stock-levels';
import { CatalogFixtureLoader } from './catalog-fixture-loader';
import { CatalogProductApi } from './catalog-product-api';
import { CatalogFixtureApi } from './catalog-fixture-api';
import { createProductCatalogRouter } from './product-catalog.routes';

export function createProductCatalogModule(db?: Db) {
  const productStorage = new InMemoryProductStorage();
  const stockStorage = new InMemoryStockStorage();
  const repository = db
    ? new MongoProductCatalogRepository(db, productStorage, stockStorage)
    : new InMemoryProductCatalogRepository(productStorage, stockStorage);
  const browse = new CatalogProductBrowse(repository);
  const stockLevels = new CatalogStockLevels(repository);
  const fixtures = new CatalogFixtureLoader(repository, repository);
  const productApi = new CatalogProductApi(browse, stockLevels);
  const fixtureApi = new CatalogFixtureApi(fixtures);
  return {
    repository,
    browse,
    stockLevels,
    productCatalogRouter: createProductCatalogRouter(productApi, fixtureApi),
  };
}

export { MongoProductCatalogRepository } from './product-catalog.mongo-repository';
export type { ProductCatalogRepository } from './product-catalog.repository';
