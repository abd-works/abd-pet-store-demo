import React from 'react';

export interface BackorderProductActionsProps {
  sku: string;
  backorderEnabled: boolean;
  inStock: boolean;
  onAdd: (sku: string) => Promise<void>;
}

export function BackorderProductActions({ sku, backorderEnabled, inStock, onAdd }: BackorderProductActionsProps) {
  const canPurchase = inStock || backorderEnabled;

  return (
    <section data-testid="backorder-product-actions" aria-label="purchase actions">
      {!inStock && backorderEnabled && (
        <p data-testid="backorder-status" role="status">Backorder</p>
      )}
      {!inStock && !backorderEnabled && (
        <p data-testid="out-of-stock-status" role="status">Out of Stock</p>
      )}
      <button
        type="button"
        disabled={!canPurchase}
        onClick={() => void onAdd(sku)}
        data-testid="add-to-cart-backorder"
      >
        {backorderEnabled && !inStock ? 'Add to Cart (Backorder)' : 'Add to Cart'}
      </button>
    </section>
  );
}
