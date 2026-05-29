import React from 'react';
import { Link } from 'react-router-dom';
import { CheckoutProgressTabs } from '../../components/CheckoutProgressTabs';
import { CustomerPage } from '../../components/CustomerPage';
import { OrderReviewSummary } from '../../components/OrderReviewSummary';
import { useCart } from '../../context/CartContext';
import { loadCheckoutDraft } from '../../checkout/checkoutDraft';

export function PayNovaHardDecline() {
  const { cart } = useCart();
  const draft = loadCheckoutDraft();

  return (
    <CustomerPage title="guest checkout — PayNova hard decline" wide>
      <CheckoutProgressTabs />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <section aria-label="PayNova decline feedback">
          <p role="alert" id="paynova-decline" aria-describedby="paynova-decline">
            hard decline reason from PayNova — insufficient wallet balance example
          </p>
          <div aria-label="alternative payment vendors">
            <button type="button">retry with PayNova</button>{' '}
            <Link to="/checkout/payment/stripewave">switch to StripeWave</Link>{' '}
            <Link to="/checkout/payment/vaultpay">switch to VaultPay</Link>
          </div>
        </section>
        <OrderReviewSummary cart={cart} draft={draft} primaryAction={<p>order remains unpaid</p>} />
      </div>
    </CustomerPage>
  );
}
