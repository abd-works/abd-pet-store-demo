import React, { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { payOrder, type PaymentErrorBody } from '@pawplace/payment-client/payment.api';

import { CheckoutProgressTabs } from '../../components/CheckoutProgressTabs';

import { CustomerPage } from '../../components/CustomerPage';

import { OrderReviewSummary } from '../../components/OrderReviewSummary';

import { useCart } from '../../context/CartContext';

import { clearCheckoutDraft, loadCheckoutDraft } from '../../checkout/checkoutDraft';



export function VaultPayBnplFlow() {

  const navigate = useNavigate();

  const { cart, refreshCart } = useCart();

  const draft = loadCheckoutDraft();

  const [eligibilityDone, setEligibilityDone] = useState(false);

  const [processing, setProcessing] = useState(false);

  const [awaitingWebhook, setAwaitingWebhook] = useState(false);



  const runEligibility = () => {

    setEligibilityDone(true);

  };



  const handleAcceptPlan = async () => {

    const activeDraft = loadCheckoutDraft();

    if (!activeDraft.orderNumber) return;

    setProcessing(true);

    try {

      const order = await payOrder(activeDraft.orderNumber, { vendor: 'vaultpay', acceptInstalmentPlan: true });

      clearCheckoutDraft();

      await refreshCart();

      navigate(`/order-confirmation/${order.orderNumber}?saveVaultPay=1`, { state: { order } });

    } catch (err) {

      const paymentErr = err as Error & { status?: number; body?: PaymentErrorBody };

      if (paymentErr.status === 504 && paymentErr.body?.awaitingWebhook) {

        setAwaitingWebhook(true);

        return;

      }

      navigate('/checkout/payment/vaultpay/declined');

    } finally {

      setProcessing(false);

    }

  };



  return (

    <CustomerPage title="guest checkout — VaultPay BNPL flow" wide>

      <CheckoutProgressTabs />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        <section aria-label="VaultPay BNPL redirect">

          <p><strong>VaultPay — buy-now-pay-later</strong></p>

          <p>redirecting to VaultPay BNPL flow</p>

          {awaitingWebhook ? (

            <p role="status">awaiting VaultPay payment confirmation</p>

          ) : !eligibilityDone ? (

            <p role="status" aria-live="polite">VaultPay eligibility check in progress</p>

          ) : (

            <div aria-label="instalment plan summary">

              <p>instalment plan schedule — 3 payments of £{(cart.subtotal / 3).toFixed(2)}</p>

              <button type="button" onClick={handleAcceptPlan} disabled={processing}>

                accept instalment plan

              </button>

              <button type="button" onClick={() => navigate('/checkout/payment/vaultpay/declined')}>

                decline instalment plan

              </button>

            </div>

          )}

          {!eligibilityDone && !awaitingWebhook && (

            <button type="button" onClick={runEligibility} style={{ marginTop: 8 }}>

              complete VaultPay eligibility check

            </button>

          )}

          <p style={{ marginTop: 16 }}>

            <Link to="/checkout/payment">return to payment method selector</Link>

          </p>

        </section>

        <OrderReviewSummary

          cart={cart}

          draft={draft}

          primaryAction={<p>awaiting VaultPay approval</p>}

        />

      </div>

    </CustomerPage>

  );

}

