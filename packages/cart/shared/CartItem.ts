import type { CartProductSnapshot } from './ShoppingCart';

/** << ValueObject >> — one product entry with quantity in a shopping cart. */
export class CartItem {
  readonly productInCart: CartProductSnapshot;
  quantity: number;
  readonly unitPriceAtTimeOfAdding: number;

  constructor(productInCart: CartProductSnapshot, quantity: number) {
    if (quantity < 1) throw new Error('cart item quantity must be at least one');
    this.productInCart = productInCart;
    this.quantity = quantity;
    this.unitPriceAtTimeOfAdding = productInCart.unitPrice;
  }

  /** @deprecated use productInCart — retained for session JSON compatibility */
  get product(): CartProductSnapshot {
    return this.productInCart;
  }

  get linePrice(): number {
    return this.unitPriceAtTimeOfAdding * this.quantity;
  }

  /** Alias for linePrice — matches cart API DTO naming. */
  get lineTotal(): number {
    return this.linePrice;
  }
}
