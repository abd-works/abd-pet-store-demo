import React, { useState } from 'react';
import type { CartItemDto } from '@pawplace/cart-shared';
import { useCart } from '../context/CartContext';

interface CartItemListProps {
  items: CartItemDto[];
}

export function CartItemList({ items }: CartItemListProps) {
  const { updateQuantity, removeItem } = useCart();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleQuantityChange = async (sku: string, raw: string) => {
    const parsed = Number(raw);
    if (!Number.isInteger(parsed) || parsed < 0) {
      setErrors((prev) => ({ ...prev, [sku]: 'quantity must be a whole number zero or greater' }));
      return;
    }
    try {
      await updateQuantity(sku, parsed);
      setErrors((prev) => {
        const next = { ...prev };
        delete next[sku];
        return next;
      });
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        [sku]: err instanceof Error ? err.message : 'invalid quantity',
      }));
    }
  };

  return (
    <ul data-testid="cart-item-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {items.map((item) => (
        <li
          key={item.sku}
          data-testid={`cart-item-${item.sku}`}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto auto auto',
            gap: 12,
            alignItems: 'center',
            padding: '12px 0',
            borderBottom: '1px solid #eee',
          }}
        >
          <span>{item.name}</span>
          <label htmlFor={`qty-${item.sku}`} className="visually-hidden">
            quantity for {item.name}
          </label>
          <input
            id={`qty-${item.sku}`}
            type="number"
            min={0}
            defaultValue={item.quantity}
            aria-describedby={errors[item.sku] ? `qty-error-${item.sku}` : undefined}
            onBlur={(event) => handleQuantityChange(item.sku, event.target.value)}
            style={{ width: 64, padding: 4 }}
          />
          <span>{item.lineTotal.toFixed(2)}</span>
          <button type="button" onClick={() => removeItem(item.sku)}>
            remove
          </button>
          {errors[item.sku] && (
            <span
              id={`qty-error-${item.sku}`}
              role="alert"
              style={{ gridColumn: '1 / -1', color: '#b00020', fontSize: 13 }}
            >
              {errors[item.sku]}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
