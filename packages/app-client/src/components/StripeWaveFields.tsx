import React from 'react';

interface StripeWaveFieldsProps {
  cardNumber: string;
  expiry: string;
  cvv: string;
  onCardNumberChange: (value: string) => void;
  onExpiryChange: (value: string) => void;
  onCvvChange: (value: string) => void;
}

export function StripeWaveFields({
  cardNumber,
  expiry,
  cvv,
  onCardNumberChange,
  onExpiryChange,
  onCvvChange,
}: StripeWaveFieldsProps) {
  return (
    <div data-testid="stripewave-fields">
      <div style={{ marginBottom: 12 }}>
        <label htmlFor="card-number">card number</label>
        <input
          id="card-number"
          inputMode="numeric"
          autoComplete="cc-number"
          value={cardNumber}
          onChange={(event) => onCardNumberChange(event.target.value)}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label htmlFor="card-expiry">expiry</label>
        <input
          id="card-expiry"
          placeholder="MM/YY"
          autoComplete="cc-exp"
          value={expiry}
          onChange={(event) => onExpiryChange(event.target.value)}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label htmlFor="card-cvv">CVV</label>
        <input
          id="card-cvv"
          inputMode="numeric"
          autoComplete="cc-csc"
          value={cvv}
          onChange={(event) => onCvvChange(event.target.value)}
        />
      </div>
    </div>
  );
}
