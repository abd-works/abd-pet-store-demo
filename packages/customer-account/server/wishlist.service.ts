import type { WishlistDto, WishlistItemDto } from '@pawplace/customer-account-shared';
import type { CatalogProductBrowse } from '../../product-catalog/server/catalog-product-browse';
import type { CatalogStockLevels } from '../../product-catalog/server/catalog-stock-levels';
import { WishlistRepository } from './wishlist.repository';

export class WishlistService {
  constructor(
    private readonly repository: WishlistRepository,
    private readonly catalog: CatalogProductBrowse,
    private readonly stockLevels: CatalogStockLevels,
  ) {}

  list(accountId: string): WishlistDto {
    const skus = this.repository.load(accountId);
    const items: WishlistItemDto[] = [];
    for (const sku of skus) {
      const product = this.catalog.getProductBySku(sku);
      if (!product) continue;
      const available = this.stockLevels.getMaxAvailableToSell(sku);
      items.push({
        sku,
        productName: product.name,
        price: product.price,
        stockAvailability: available > 0 ? 'In stock' : 'Out of stock',
      });
    }
    return { items };
  }

  add(accountId: string, sku: string): void {
    const product = this.catalog.getProductBySku(sku);
    if (!product) throw new Error('Product not found');
    const list = this.repository.load(accountId);
    list.add(sku);
    this.repository.save(accountId, list);
  }

  remove(accountId: string, sku: string): void {
    const list = this.repository.load(accountId);
    list.delete(sku);
    this.repository.save(accountId, list);
  }

  contains(accountId: string, sku: string): boolean {
    return this.repository.load(accountId).has(sku);
  }

  findAccountsWithSkuOnWishlist(sku: string): string[] {
    return this.repository.findAccountsWithSku(sku);
  }
}
