export class WishlistRepository {
  private readonly lists = new Map<string, Set<string>>();

  load(accountId: string): Set<string> {
    if (!this.lists.has(accountId)) this.lists.set(accountId, new Set());
    return this.lists.get(accountId)!;
  }

  save(accountId: string, skus: Set<string>): void {
    this.lists.set(accountId, skus);
  }

  findByAccountId(accountId: string): string[] {
    return [...this.load(accountId)];
  }

  findAccountsWithSku(sku: string): string[] {
    const accountIds: string[] = [];
    for (const [accountId, skus] of this.lists.entries()) {
      if (skus.has(sku)) {
        accountIds.push(accountId);
      }
    }
    return accountIds;
  }

  reset(): void {
    this.lists.clear();
  }
}
