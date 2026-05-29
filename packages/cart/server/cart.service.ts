import {
  ShoppingCart,
  formatCurrency,
  parsePriceAmount,
  type CartDto,
  type CartProductSnapshot,
} from '@pawplace/cart-shared';
import type { CartRepository } from './cart.repository';
import type { CartAccountRepository } from './cart.account-repository';
import type { CatalogProductReader } from './catalog-product-reader';

export class OutOfStockError extends Error {
  constructor(sku: string) {
    super(`Out of stock: ${sku}`);
    this.name = 'OutOfStockError';
  }
}

export class ProductNotFoundError extends Error {
  constructor(sku: string) {
    super(`Product not found: ${sku}`);
    this.name = 'ProductNotFoundError';
  }
}

export class InvalidQuantityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidQuantityError';
  }
}

export class InsufficientStockError extends Error {
  constructor(sku: string, available: number) {
    super(`Insufficient stock for ${sku}: ${available} available`);
    this.name = 'InsufficientStockError';
  }
}

function toCartDto(cart: ShoppingCart): CartDto {
  return {
    items: cart.cartItems.map((item) => ({
      sku: item.product.sku,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      lineTotal: item.lineTotal,
    })),
    itemCount: cart.itemCount,
    subtotal: cart.subtotal,
    subtotalFormatted: formatCurrency(cart.subtotal),
  };
}

function toProductSnapshot(product: { sku: string; name: string; price: string }): CartProductSnapshot {
  return {
    sku: product.sku,
    name: product.name,
    price: product.price,
    unitPrice: parsePriceAmount(product.price),
  };
}

export class CartService {
  constructor(
    private readonly repository: CartRepository,
    private readonly catalog: CatalogProductReader,
    private readonly accountRepository?: CartAccountRepository,
  ) {}

  async getCart(sessionId: string): Promise<CartDto> {
    const cart = await this.repository.load(sessionId);
    return toCartDto(cart);
  }

  async addItem(sessionId: string, sku: string, quantity = 1): Promise<CartDto> {
    const product = await this.catalog.getProductBySku(sku);
    if (!product) throw new ProductNotFoundError(sku);

    const available = await this.catalog.getMaxAvailableToSell(sku);
    if (available <= 0) throw new OutOfStockError(sku);

    const cart = await this.repository.load(sessionId);
    const existing = cart.cartItems.find((item) => item.product.sku === sku);
    const nextQty = (existing?.quantity ?? 0) + quantity;
    if (nextQty > available) throw new InsufficientStockError(sku, available);

    cart.addItem(toProductSnapshot(product), quantity);
    await this.repository.save(sessionId, cart);
    return toCartDto(cart);
  }

  async updateQuantity(sessionId: string, sku: string, quantity: number): Promise<CartDto> {
    if (!Number.isInteger(quantity)) throw new InvalidQuantityError('quantity must be a whole number');
    if (quantity < 0) throw new InvalidQuantityError('quantity must be zero or greater');

    const cart = await this.repository.load(sessionId);
    const item = cart.cartItems.find((entry) => entry.product.sku === sku);
    if (!item) throw new ProductNotFoundError(sku);

    if (quantity === 0) {
      cart.removeItem(sku);
      await this.repository.save(sessionId, cart);
      return toCartDto(cart);
    }

    const available = await this.catalog.getMaxAvailableToSell(sku);
    if (quantity > available) throw new InsufficientStockError(sku, available);

    cart.updateItemQuantity(sku, quantity);
    await this.repository.save(sessionId, cart);
    return toCartDto(cart);
  }

  async removeItem(sessionId: string, sku: string): Promise<CartDto> {
    const cart = await this.repository.load(sessionId);
    cart.removeItem(sku);
    await this.repository.save(sessionId, cart);
    return toCartDto(cart);
  }

  async loadRawCart(sessionId: string): Promise<ShoppingCart> {
    return this.repository.load(sessionId);
  }

  async clearCart(sessionId: string): Promise<void> {
    await this.repository.clear(sessionId);
  }

  async addItemToAccountCart(accountId: string, sku: string, quantity = 1): Promise<CartDto> {
    if (!this.accountRepository) throw new Error('account cart not configured');
    const product = await this.catalog.getProductBySku(sku);
    if (!product) throw new ProductNotFoundError(sku);

    const available = await this.catalog.getMaxAvailableToSell(sku);
    if (available <= 0) throw new OutOfStockError(sku);

    const cart = await this.accountRepository.load(accountId);
    const existing = cart.cartItems.find((item) => item.product.sku === sku);
    const nextQty = (existing?.quantity ?? 0) + quantity;
    if (nextQty > available) throw new InsufficientStockError(sku, available);

    cart.addItem(toProductSnapshot(product), quantity);
    await this.accountRepository.save(accountId, cart);
    return toCartDto(cart);
  }

  async mergeGuestCartIntoAccount(sessionId: string, accountId: string): Promise<CartDto> {
    if (!this.accountRepository) {
      return this.getCart(sessionId);
    }

    const guestCart = await this.repository.load(sessionId);
    const accountCart = await this.accountRepository.load(accountId);

    for (const item of guestCart.cartItems) {
      accountCart.addItem(item.productInCart, item.quantity);
    }

    await this.accountRepository.save(accountId, accountCart);
    await this.repository.save(sessionId, accountCart);
    return toCartDto(accountCart);
  }

  async getAccountCart(accountId: string): Promise<CartDto> {
    if (!this.accountRepository) throw new Error('account cart not configured');
    const cart = await this.accountRepository.load(accountId);
    return toCartDto(cart);
  }
}

export { toCartDto };
