import React from 'react';
import { Link } from 'react-router-dom';
import { CheckoutProgressTabs } from '../../components/CheckoutProgressTabs';
import { CustomerPage } from '../../components/CustomerPage';
import { OrderReviewSummary } from '../../components/OrderReviewSummary';
import { useCart } from '../../context/CartContext';
import { loadCheckoutDraft } from '../../checkout/checkoutDraft';

export function VaultPayHardDecline() {
  const { cart } = useCart();
  const draft = loadCheckoutDraft();

  return (
    <CustomerPage title="guest checkout — VaultPay hard decline" wide>
      <CheckoutProgressTabs />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <section aria-label="VaultPay decline feedback">
          <p role="alert">
            buy-now-pay-later not available for this transaction — eligibility failed — credit check failed
          </p>
          <div aria-label="alternative payment vendors">
            <Link to="/checkout/payment/stripewave">switch to StripeWave</Link>{' '}
            <Link to="/checkout/payment/paynova">switch to PayNova</Link>
          </div>
        </section>
        <OrderReviewSummary cart={cart} draft={draft} primaryAction={<p>order remains unpaid</p>} />
      </div>
    </CustomerPage>
  );
}
