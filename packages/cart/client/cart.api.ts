import type { CartDto } from '@pawplace/cart-shared';
import { cartDtoSchema } from '@pawplace/cart-shared';
import { performFetch } from '../../shared/http-io';
import { assertResponseOk } from '../../shared/http-client';

const emptyCart: CartDto = {
  items: [],
  itemCount: 0,
  subtotal: 0,
  subtotalFormatted: '£0.00',
};

async function readCart(response: Response): Promise<CartDto> {
  assertResponseOk(response, 'cart');
  const raw = await response.json();
  return cartDtoSchema.parse(raw);
}

export function fetchCart(): Promise<CartDto> {
  return performFetch('/api/cart', { credentials: 'include' })
    .then(readCart)
    .catch(() => emptyCart);
}

export function addCartItem(sku: string, quantity = 1): Promise<CartDto> {
  return performFetch('/api/cart/items', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sku, quantity }),
  }).then(readCart);
}

export function updateCartItemQuantity(sku: string, quantity: number): Promise<CartDto> {
  return performFetch(`/api/cart/items/${encodeURIComponent(sku)}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  }).then(readCart);
}

export function removeCartItem(sku: string): Promise<CartDto> {
  return performFetch(`/api/cart/items/${encodeURIComponent(sku)}`, {
    method: 'DELETE',
    credentials: 'include',
  }).then(readCart);
}
