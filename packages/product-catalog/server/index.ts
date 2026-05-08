import { ProductCatalogRepository } from './product-catalog.repository';
import { ProductCatalogService } from './product-catalog.service';
import { ProductCatalogController } from './product-catalog.controller';
import { createProductCatalogRouter } from './product-catalog.routes';

const repository = new ProductCatalogRepository();
const service = new ProductCatalogService(repository);
const controller = new ProductCatalogController(service);

export const productCatalogRouter = createProductCatalogRouter(controller);
