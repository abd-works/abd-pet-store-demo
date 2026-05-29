import type { CatalogProductBrowse } from '../../product-catalog/server/catalog-product-browse';
import type { CatalogStockLevels } from '../../product-catalog/server/catalog-stock-levels';
import type { CatalogProductReader } from './catalog-product-reader';
import { CartController } from './cart.controller';
import { createCartRouter } from './cart.routes';
import { CartSessionRepository } from './cart.session-repository';
import { InMemoryCartAccountRepository } from './cart.account-repository';
import { CartService } from './cart.service';

class CatalogProductReaderAdapter implements CatalogProductReader {
  constructor(
    private readonly browse: CatalogProductBrowse,
    private readonly stock: CatalogStockLevels,
  ) {}

  async getProductBySku(sku: string) {
    const product = this.browse.getProductBySku(sku);
    if (!product) return null;
    return { sku: product.sku, name: product.name, price: product.price };
  }

  async getMaxAvailableToSell(productSku: string): Promise<number> {
    return this.stock.getMaxAvailableToSell(productSku);
  }
}

export function createCartModule(browse: CatalogProductBrowse, stockLevels: CatalogStockLevels) {
  const repository = new CartSessionRepository();
  const accountRepository = new InMemoryCartAccountRepository();
  const catalog = new CatalogProductReaderAdapter(browse, stockLevels);
  const service = new CartService(repository, catalog, accountRepository);
  const controller = new CartController(service);
  return {
    cartRouter: createCartRouter(controller),
    cartService: service,
    sessionRepository: repository,
    accountRepository,
  };
}

export { CartService, CartSessionRepository };
