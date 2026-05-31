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
import { ProductSearchService } from './product-search.service';
import { ProductSearchController } from './product-search.controller';
import { createProductSearchRouter } from './product-search.routes';
import { InventoryDashboardService } from './inventory-dashboard.service';
import { InventoryDashboardController } from './inventory-dashboard.controller';
import { createInventoryDashboardRouter } from './inventory-dashboard.routes';

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
  const searchService = new ProductSearchService(repository, stockLevels);
  const searchController = new ProductSearchController(searchService);
  const inventoryDashboardService = new InventoryDashboardService(repository);
  const inventoryDashboardController = new InventoryDashboardController(inventoryDashboardService);
  return {
    repository,
    browse,
    stockLevels,
    searchService,
    productCatalogRouter: createProductCatalogRouter(productApi, fixtureApi),
    productSearchRouter: createProductSearchRouter(searchController),
    inventoryDashboardRouter: createInventoryDashboardRouter(inventoryDashboardController),
  };
}

export { MongoProductCatalogRepository } from './product-catalog.mongo-repository';
export type { ProductCatalogRepository } from './product-catalog.repository';
export { createReviewModule, resetReviewModuleForTests } from './review.module';
export { ReviewService } from './review.service';
