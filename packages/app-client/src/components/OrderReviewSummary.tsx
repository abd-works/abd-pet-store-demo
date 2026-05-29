import React from 'react';
import { Link } from 'react-router-dom';
import type { CartDto } from '@pawplace/cart-shared';
import type { CheckoutDraft } from '../checkout/checkoutDraft';

interface OrderReviewSummaryProps {
  cart: CartDto;
  draft: CheckoutDraft;
  backPath?: string;
  backLabel?: string;
  primaryAction?: React.ReactNode;
}

export function OrderReviewSummary({
  cart,
  draft,
  backPath = '/checkout/billing',
  backLabel = 'back',
  primaryAction,
}: OrderReviewSummaryProps) {
  const isStandardDelivery = draft.deliveryOption === 'standard_delivery';

  return (
    <aside aria-label="order review summary" style={{ background: '#fff', border: '1px solid #ddd', padding: 16 }}>
      <h2 style={{ fontSize: 16 }}>order line item list</h2>
      <ul>
        {cart.items.map((item) => (
          <li key={item.sku}>{item.name} × {item.quantity}</li>
        ))}
      </ul>
      {isStandardDelivery && draft.shippingAddress ? (
        <>
          <p>shipping address: {draft.shippingAddress.addressLine1}, {draft.shippingAddress.city}</p>
          <p>shipping cost: £4.99</p>
          <p>estimated delivery window: 3–5 business days</p>
        </>
      ) : draft.pickupStoreName ? (
        <p>pickup store: {draft.pickupStoreName}</p>
      ) : null}
      {draft.billingAddress ? (
        <p>billing address: {draft.billingAddress.addressLine1}, {draft.billingAddress.city}</p>
      ) : null}
      {draft.deliveryOption ? <p>delivery option: {draft.deliveryOption.replace(/_/g, ' ')}</p> : null}
      <p>order total: {cart.subtotalFormatted}</p>
      {backPath && <Link to={backPath}>{backLabel}</Link>}
      {primaryAction}
    </aside>
  );
}
