import { ShoppingCart } from '@pawplace/cart-shared';

export interface CartAccountRepository {
  load(accountId: string): Promise<ShoppingCart>;
  save(accountId: string, cart: ShoppingCart): Promise<void>;
  clear(accountId: string): Promise<void>;
}

export class InMemoryCartAccountRepository implements CartAccountRepository {
  private readonly carts = new Map<string, ShoppingCart>();

  async load(accountId: string): Promise<ShoppingCart> {
    return this.carts.get(accountId) ?? new ShoppingCart(`account:${accountId}`);
  }

  async save(accountId: string, cart: ShoppingCart): Promise<void> {
    this.carts.set(accountId, cart);
  }

  async clear(accountId: string): Promise<void> {
    this.carts.delete(accountId);
  }

  resetAll(): void {
    this.carts.clear();
  }
}
