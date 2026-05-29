import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { WishlistItemDto } from '@pawplace/customer-account-shared';
import { addCartItem } from '@pawplace/cart-client/cart.api';
import { fetchWishlist, removeFromWishlist } from '@pawplace/customer-account-client';
import { useCart } from '../../context/CartContext';
import { CustomerPage } from '../../components/CustomerPage';
import { AccountSettingsLayout } from '../../components/AccountSettingsNav';

export function WishlistPage() {
  const [items, setItems] = useState<WishlistItemDto[]>([]);
  const { refreshCart } = useCart();

  const load = async () => {
    const list = await fetchWishlist();
    setItems(list.items);
  };

  useEffect(() => {
    void load();
  }, []);

  const handleAddToCart = async (sku: string) => {
    await addCartItem(sku, 1);
    await refreshCart();
  };

  const handleRemove = async (sku: string) => {
    await removeFromWishlist(sku);
    await load();
  };

  return (
    <CustomerPage title="wishlist page">
      <AccountSettingsLayout>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {items.map((item) => (
            <li key={item.sku} style={{ marginBottom: 12, padding: 12, border: '1px solid #ddd' }}>
              <Link to={`/products/${item.sku}`}>{item.productName}</Link>
              <p>{item.price}</p>
              <p>stock availability: {item.stockAvailability}</p>
              <button type="button" onClick={() => void handleAddToCart(item.sku)}>add to cart</button>{' '}
              <button type="button" onClick={() => void handleRemove(item.sku)}>remove from wishlist</button>
            </li>
          ))}
        </ul>
      </AccountSettingsLayout>
    </CustomerPage>
  );
}
