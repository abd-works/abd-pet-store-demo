import type { CartItem, CartProductSnapshot } from '@pawplace/cart-shared';

export interface OrderLineItemSnapshot {
  sku: string;
  name: string;
  price: string;
  quantity: number;
  lineTotal: number;
}

/** << ValueObject >> — product with price snapshot in a confirmed order. */
export class OrderLineItem {
  readonly orderedProductSku: string;
  readonly productNameSnapshot: string;
  readonly skuSnapshot: string;
  readonly unitPriceSnapshot: number;
  readonly priceDisplay: string;
  readonly quantity: number;
  readonly lineTotal: number;

  constructor(snapshot: OrderLineItemSnapshot) {
    if (snapshot.quantity < 1) throw new Error('order line item quantity must be at least one');
    this.orderedProductSku = snapshot.sku;
    this.productNameSnapshot = snapshot.name;
    this.skuSnapshot = snapshot.sku;
    this.priceDisplay = snapshot.price;
    this.unitPriceSnapshot = snapshot.lineTotal / snapshot.quantity;
    this.quantity = snapshot.quantity;
    this.lineTotal = snapshot.lineTotal;
  }

  static snapshotFromCartItem(cartItem: CartItem): OrderLineItem {
    const product = cartItem.productInCart;
    return new OrderLineItem({
      sku: product.sku,
      name: product.name,
      price: product.price,
      quantity: cartItem.quantity,
      lineTotal: cartItem.linePrice,
    });
  }

  static snapshotFromProduct(product: CartProductSnapshot, quantity: number): OrderLineItem {
    return new OrderLineItem({
      sku: product.sku,
      name: product.name,
      price: product.price,
      quantity,
      lineTotal: product.unitPrice * quantity,
    });
  }

  toJSON(): OrderLineItemSnapshot {
    return {
      sku: this.skuSnapshot,
      name: this.productNameSnapshot,
      price: this.priceDisplay,
      quantity: this.quantity,
      lineTotal: this.lineTotal,
    };
  }
}
