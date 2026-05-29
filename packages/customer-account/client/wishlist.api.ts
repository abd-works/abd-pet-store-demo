import type { WishlistDto } from '@pawplace/customer-account-shared';
import { wishlistDtoSchema } from '@pawplace/customer-account-shared';
import { performFetch } from '../../shared/http-io';
import { assertResponseOk } from '../../shared/http-client';

export async function fetchWishlist(): Promise<WishlistDto> {
  const response = await performFetch('/api/wishlist', { credentials: 'include' });
  assertResponseOk(response, 'wishlist');
  return wishlistDtoSchema.parse(await response.json());
}

export async function addToWishlist(sku: string): Promise<void> {
  const response = await performFetch('/api/wishlist', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sku }),
  });
  assertResponseOk(response, 'add wishlist');
}

export async function removeFromWishlist(sku: string): Promise<void> {
  const response = await performFetch(`/api/wishlist/${encodeURIComponent(sku)}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  assertResponseOk(response, 'remove wishlist');
}

export async function isInWishlist(sku: string): Promise<boolean> {
  const response = await performFetch(`/api/wishlist/${encodeURIComponent(sku)}/contains`, {
    credentials: 'include',
  });
  const body = await response.json();
  return Boolean(body.inWishlist);
}
