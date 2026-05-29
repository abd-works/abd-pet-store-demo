import React, { useState } from 'react';

interface AddToCartButtonProps {
  sku: string;
  disabled?: boolean;
  unavailabilityMessage?: string;
  onAdd: (sku: string) => Promise<void>;
}

export function AddToCartButton({ sku, disabled, unavailabilityMessage, onAdd }: AddToCartButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const handleClick = async () => {
    setError(null);
    setAdding(true);
    try {
      await onAdd(sku);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Out of stock');
    } finally {
      setAdding(false);
    }
  };

  const isDisabled = disabled || adding;

  return (
    <section aria-label="purchase actions" data-testid="purchase-actions" style={{ marginTop: 24 }}>
      {unavailabilityMessage && (
        <p id={`unavailability-${sku}`} role="status" style={{ color: '#b00020', marginBottom: 8 }}>
          {unavailabilityMessage}
        </p>
      )}
      {error && (
        <p id={`add-cart-error-${sku}`} role="alert" style={{ color: '#b00020', marginBottom: 8 }}>
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={handleClick}
        disabled={isDisabled}
        aria-describedby={
          [unavailabilityMessage ? `unavailability-${sku}` : null, error ? `add-cart-error-${sku}` : null]
            .filter(Boolean)
            .join(' ') || undefined
        }
        style={{
          padding: '10px 20px',
          background: isDisabled ? '#ccc' : '#111',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: isDisabled ? 'not-allowed' : 'pointer',
        }}
      >
        Add to Cart
      </button>
    </section>
  );
}
