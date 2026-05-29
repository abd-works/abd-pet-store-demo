import { CartItem } from './CartItem';

export interface CartProductSnapshot {
  sku: string;
  name: string;
  price: string;
  unitPrice: number;
}

/** << Entity >> — session-scoped container of cart items (Increment 2 guest path). */
export class ShoppingCart {
  readonly sessionId: string;
  private items: CartItem[] = [];

  constructor(sessionId: string) {
    if (!sessionId) throw new Error('sessionId is required');
    this.sessionId = sessionId;
  }

  get cartItems(): readonly CartItem[] {
    return this.items;
  }

  get itemCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  get cartSubtotal(): number {
    return this.items.reduce((sum, item) => sum + item.linePrice, 0);
  }

  /** Alias for cartSubtotal — matches cart API DTO naming. */
  get subtotal(): number {
    return this.cartSubtotal;
  }

  get isEmpty(): boolean {
    return this.items.length === 0;
  }

  addItem(product: CartProductSnapshot, quantity: number): void {
    if (quantity < 1) throw new Error('quantity must be at least one');
    const existing = this.items.find((item) => item.productInCart.sku === product.sku);
    if (existing) {
      existing.quantity += quantity;
      return;
    }
    this.items.push(new CartItem(product, quantity));
  }

  updateItemQuantity(sku: string, quantity: number): void {
    if (quantity === 0) {
      this.removeItem(sku);
      return;
    }
    if (quantity < 0) throw new Error('quantity must be zero or greater');
    const item = this.items.find((entry) => entry.productInCart.sku === sku);
    if (!item) throw new Error(`cart item not found: ${sku}`);
    item.quantity = quantity;
  }

  removeItem(sku: string): void {
    this.items = this.items.filter((item) => item.productInCart.sku !== sku);
  }

  toJSON(): { sessionId: string; items: { product: CartProductSnapshot; quantity: number }[] } {
    return {
      sessionId: this.sessionId,
      items: this.items.map((item) => ({ product: item.productInCart, quantity: item.quantity })),
    };
  }

  static fromJSON(
    sessionId: string,
    data: { items: { product: CartProductSnapshot; quantity: number }[] },
  ): ShoppingCart {
    const cart = new ShoppingCart(sessionId);
    for (const row of data.items ?? []) {
      cart.items.push(new CartItem(row.product, row.quantity));
    }
    return cart;
  }
}

export function parsePriceAmount(price: string): number {
  const numeric = price.replace(/[^0-9.]/g, '');
  const value = parseFloat(numeric);
  return Number.isFinite(value) ? value : 0;
}

export function formatCurrency(amount: number, currencySymbol = '£'): string {
  return `${currencySymbol}${amount.toFixed(2)}`;
}
