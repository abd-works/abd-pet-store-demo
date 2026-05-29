import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { CartDto } from '@pawplace/cart-shared';
import {
  addCartItem,
  fetchCart,
  removeCartItem,
  updateCartItemQuantity,
} from '@pawplace/cart-client/cart.api';

interface CartContextValue {
  cart: CartDto;
  loading: boolean;
  refreshCart: () => Promise<void>;
  addItem: (sku: string, quantity?: number) => Promise<void>;
  updateQuantity: (sku: string, quantity: number) => Promise<void>;
  removeItem: (sku: string) => Promise<void>;
}

const emptyCart: CartDto = {
  items: [],
  itemCount: 0,
  subtotal: 0,
  subtotalFormatted: '£0.00',
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartDto>(emptyCart);
  const [loading, setLoading] = useState(true);

  const refreshCart = useCallback(async () => {
    const next = await fetchCart();
    setCart(next);
  }, []);

  useEffect(() => {
    refreshCart().finally(() => setLoading(false));
  }, [refreshCart]);

  const addItem = useCallback(
    async (sku: string, quantity = 1) => {
      const next = await addCartItem(sku, quantity);
      setCart(next);
    },
    [],
  );

  const updateQuantity = useCallback(async (sku: string, quantity: number) => {
    const next = await updateCartItemQuantity(sku, quantity);
    setCart(next);
  }, []);

  const removeItem = useCallback(async (sku: string) => {
    const next = await removeCartItem(sku);
    setCart(next);
  }, []);

  const value = useMemo(
    () => ({ cart, loading, refreshCart, addItem, updateQuantity, removeItem }),
    [cart, loading, refreshCart, addItem, updateQuantity, removeItem],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
