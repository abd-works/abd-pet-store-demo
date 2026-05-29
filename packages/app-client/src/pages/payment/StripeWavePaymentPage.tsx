import React, { lazy, Suspense, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { validatePaymentCard } from '@pawplace/payment-shared';
import { payOrder, type PaymentErrorBody } from '@pawplace/payment-client/payment.api';
import { CheckoutProgressTabs } from '../../components/CheckoutProgressTabs';
import { CustomerPage } from '../../components/CustomerPage';
import { OrderReviewSummary } from '../../components/OrderReviewSummary';
import { useCart } from '../../context/CartContext';
import { useCustomerSession } from '../../context/CustomerSessionContext';
import { clearCheckoutDraft, loadCheckoutDraft } from '../../checkout/checkoutDraft';

const StripeWaveFields = lazy(() =>
  import('../../components/StripeWaveFields').then((module) => ({ default: module.StripeWaveFields })),
);

export function StripeWavePaymentPage() {
  const navigate = useNavigate();
  const { cart, refreshCart } = useCart();
  const { isVerified } = useCustomerSession();
  const draft = loadCheckoutDraft();
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [saveForFuture, setSaveForFuture] = useState(false);

  const validateCard = (): boolean => {
    const validationError = validatePaymentCard({ cardNumber, expiry, cvv });
    if (validationError) {
      setError(validationError);
      return false;
    }
    setError(null);
    return true;
  };

  const handleConfirm = async () => {
    const activeDraft = loadCheckoutDraft();
    if (!activeDraft.orderNumber) return;
    if (!validateCard()) return;

    setProcessing(true);
    setUnavailable(false);
    setRetrying(false);
    try {
      const order = await payOrder(activeDraft.orderNumber, {
        vendor: 'stripewave',
        cardNumber,
        expiry,
        cvv,
      });

      if (!order?.orderNumber) {
        throw new Error('payment failed');
      }

      clearCheckoutDraft();
      await refreshCart();
      navigate(`/order-confirmation/${order.orderNumber}`);
    } catch (err) {
      const paymentErr = err as Error & { status?: number; body?: PaymentErrorBody };
      if (paymentErr.body?.retrying) {
        setRetrying(true);
        setError('retrying payment — automatic payment retry in progress');
        navigate('/checkout/payment/retrying');
        return;
      }
      if (paymentErr.body?.retryExhausted || paymentErr.body?.restoreSelector) {
        navigate('/checkout/payment/retry-exhausted');
        return;
      }
      if (paymentErr.status === 503) {
        setUnavailable(true);
        setError('StripeWave service unavailable — please retry after a moment.');
      } else {
        setError(paymentErr.message ?? 'card declined');
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <CustomerPage title="guest checkout — StripeWave card entry" wide>
      <CheckoutProgressTabs />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <section aria-label="payment">
          <p>
            <strong>StripeWave — card</strong> (selected){' '}
            <Link to="/checkout/payment">change payment method</Link>
          </p>
          {retrying && (
            <p role="status" aria-live="polite" data-testid="payment-retrying">
              retrying payment — automatic payment retry in progress
            </p>
          )}
          {processing && (
            <p role="status" aria-live="polite" data-testid="payment-processing">
              processing indicator — payment in flight…
            </p>
          )}
          {error && (
            <p role="alert" id="payment-error" aria-describedby="payment-error" style={{ color: '#b00020' }}>
              {error}
            </p>
          )}
          <Suspense fallback={<p>Loading StripeWave…</p>}>
            <StripeWaveFields
              cardNumber={cardNumber}
              expiry={expiry}
              cvv={cvv}
              onCardNumberChange={setCardNumber}
              onExpiryChange={setExpiry}
              onCvvChange={setCvv}
            />
          </Suspense>
          {isVerified && (
            <label htmlFor="save-payment-future" style={{ display: 'block', marginTop: 12 }}>
              <input
                id="save-payment-future"
                type="checkbox"
                checked={saveForFuture}
                onChange={(e) => setSaveForFuture(e.target.checked)}
              />{' '}
              save this payment method for future orders
            </label>
          )}
          {(error || unavailable) && (
            <button type="button" onClick={handleConfirm} style={{ marginTop: 8 }}>
              retry payment
            </button>
          )}
        </section>
        <OrderReviewSummary
          cart={cart}
          draft={draft}
          primaryAction={
            <button
              type="button"
              disabled={processing || !loadCheckoutDraft().orderNumber}
              onClick={handleConfirm}
              style={{ display: 'block', marginTop: 12, padding: '10px 16px' }}
            >
              confirm order
            </button>
          }
        />
      </div>
    </CustomerPage>
  );
}
