import React from 'react';
import { Link } from 'react-router-dom';
import { CheckoutProgressTabs } from '../../components/CheckoutProgressTabs';
import { CustomerPage } from '../../components/CustomerPage';
import { OrderReviewSummary } from '../../components/OrderReviewSummary';
import { useCart } from '../../context/CartContext';
import { loadCheckoutDraft } from '../../checkout/checkoutDraft';

export function PaymentRetryExhausted() {
  const { cart } = useCart();
  const draft = loadCheckoutDraft();

  return (
    <CustomerPage title="guest checkout — payment retry exhausted" wide>
      <CheckoutProgressTabs />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <section aria-label="retry exhaustion feedback">
          <p role="alert">payment could not be processed — retry window exhausted</p>
          <fieldset aria-label="payment method selector">
            <legend>payment method selector</legend>
            <Link to="/checkout/payment/stripewave">StripeWave — card</Link>
            <br />
            <Link to="/checkout/payment/paynova">PayNova — digital wallet</Link>
            <br />
            <Link to="/checkout/payment/vaultpay">VaultPay — buy-now-pay-later</Link>
            <br />
            <Link to="/checkout/payment/stripewave">manual card entry</Link>
          </fieldset>
        </section>
        <OrderReviewSummary cart={cart} draft={draft} primaryAction={<p>order remains unpaid</p>} />
      </div>
    </CustomerPage>
  );
}
