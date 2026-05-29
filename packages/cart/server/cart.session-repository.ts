import { ShoppingCart } from '@pawplace/cart-shared';
import type { CartRepository } from './cart.repository';

export class CartSessionRepository implements CartRepository {
  private readonly store = new Map<string, ReturnType<ShoppingCart['toJSON']>>();

  async load(sessionId: string): Promise<ShoppingCart> {
    const saved = this.store.get(sessionId);
    if (!saved) return new ShoppingCart(sessionId);
    return ShoppingCart.fromJSON(sessionId, saved);
  }

  async save(sessionId: string, cart: ShoppingCart): Promise<void> {
    this.store.set(sessionId, cart.toJSON());
  }

  async clear(sessionId: string): Promise<void> {
    this.store.delete(sessionId);
  }

  resetAll(): void {
    this.store.clear();
  }
}
