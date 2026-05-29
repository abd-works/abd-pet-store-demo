import type { ShoppingCart } from '@pawplace/cart-shared';

export interface CartRepository {
  load(sessionId: string): Promise<ShoppingCart>;
  save(sessionId: string, cart: ShoppingCart): Promise<void>;
  clear(sessionId: string): Promise<void>;
}
