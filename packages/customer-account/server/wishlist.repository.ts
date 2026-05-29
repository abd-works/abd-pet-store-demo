export class WishlistRepository {
  private readonly lists = new Map<string, Set<string>>();

  load(accountId: string): Set<string> {
    if (!this.lists.has(accountId)) this.lists.set(accountId, new Set());
    return this.lists.get(accountId)!;
  }

  save(accountId: string, skus: Set<string>): void {
    this.lists.set(accountId, skus);
  }
}
