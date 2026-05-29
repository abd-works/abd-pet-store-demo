import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPaymentRetryStatus, payOrder } from '@pawplace/payment-client/payment.api';
import { CheckoutProgressTabs } from '../../components/CheckoutProgressTabs';
import { CustomerPage } from '../../components/CustomerPage';
import { OrderReviewSummary } from '../../components/OrderReviewSummary';
import { useCart } from '../../context/CartContext';
import { clearCheckoutDraft, loadCheckoutDraft } from '../../checkout/checkoutDraft';

export function PaymentRetryIndicator() {
  const navigate = useNavigate();
  const { cart, refreshCart } = useCart();
  const draft = loadCheckoutDraft();
  const [attemptCount, setAttemptCount] = useState(1);
  const [statusText, setStatusText] = useState('retrying payment');

  useEffect(() => {
    const orderNumber = loadCheckoutDraft().orderNumber;
    if (!orderNumber) return;

    const poll = window.setInterval(async () => {
      try {
        const status = await fetchPaymentRetryStatus(orderNumber);
        setAttemptCount(status.attemptCount);
        if (status.exhausted) {
          window.clearInterval(poll);
          navigate('/checkout/payment/retry-exhausted');
          return;
        }
        if (!status.retrying) {
          window.clearInterval(poll);
          try {
            const order = await payOrder(orderNumber, {
              vendor: 'stripewave',
              cardNumber: '4242424242424242',
              expiry: '12/30',
              cvv: '123',
            });
            clearCheckoutDraft();
            await refreshCart();
            navigate(`/order-confirmation/${order.orderNumber}`, { state: { order } });
          } catch {
            navigate('/checkout/payment/retry-exhausted');
          }
        }
      } catch {
        setStatusText('automatic payment retry in progress');
      }
    }, 1500);

    return () => window.clearInterval(poll);
  }, [navigate, refreshCart]);

  return (
    <CustomerPage title="guest checkout — payment retry in progress" wide>
      <CheckoutProgressTabs />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <section aria-label="payment retry indicator">
          <p role="status" aria-live="polite" data-testid="payment-retry-indicator">
            {statusText} — automatic payment retry in progress — attempt {attemptCount} within retry window
          </p>
          <p>retrying through same payment vendor</p>
        </section>
        <OrderReviewSummary cart={cart} draft={draft} primaryAction={<p>payment not yet confirmed</p>} />
      </div>
    </CustomerPage>
  );
}
