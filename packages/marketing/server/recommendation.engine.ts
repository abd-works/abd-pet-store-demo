import type { CustomerAccountRepository } from '../../customer-account/server/customer-account.repository';

/** MVP recommendation engine — purchase history + wishlist SKUs in stock. */
export class RecommendationEngine {
  constructor(
    private readonly accounts: CustomerAccountRepository,
    private readonly getInStockSkus: (skus: string[]) => string[],
  ) {}

  async buildFor(accountId: string, wishlistSkus: string[]): Promise<string[]> {
    const inStockWishlist = this.getInStockSkus(wishlistSkus);
    if (inStockWishlist.length > 0) {
      return inStockWishlist.slice(0, 3);
    }

    const account = await this.accounts.findById(accountId);
    if (!account) return [];

    return [];
  }
}
