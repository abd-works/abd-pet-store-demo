import React, { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { payOrder, type PaymentErrorBody } from '@pawplace/payment-client/payment.api';

import { CheckoutProgressTabs } from '../../components/CheckoutProgressTabs';

import { CustomerPage } from '../../components/CustomerPage';

import { OrderReviewSummary } from '../../components/OrderReviewSummary';

import { useCart } from '../../context/CartContext';

import { clearCheckoutDraft, loadCheckoutDraft } from '../../checkout/checkoutDraft';



export function PayNovaWalletFlow() {

  const navigate = useNavigate();

  const { cart, refreshCart } = useCart();

  const draft = loadCheckoutDraft();

  const [authorising, setAuthorising] = useState(false);

  const [awaitingWebhook, setAwaitingWebhook] = useState(false);



  const handleAuthorise = async () => {

    const activeDraft = loadCheckoutDraft();

    if (!activeDraft.orderNumber) return;

    setAuthorising(true);

    try {

      const order = await payOrder(activeDraft.orderNumber, { vendor: 'paynova', cardNumber: 'authorized' });

      clearCheckoutDraft();

      await refreshCart();

      navigate(`/order-confirmation/${order.orderNumber}?savePayNova=1`, { state: { order } });

    } catch (err) {

      const paymentErr = err as Error & { status?: number; body?: PaymentErrorBody };

      if (paymentErr.status === 504 && paymentErr.body?.awaitingWebhook) {

        setAwaitingWebhook(true);

        return;

      }

      navigate('/checkout/payment/paynova/declined');

    } finally {

      setAuthorising(false);

    }

  };



  return (

    <CustomerPage title="guest checkout — PayNova wallet flow" wide>

      <CheckoutProgressTabs />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        <section aria-label="PayNova wallet authentication">

          <p><strong>PayNova — digital wallet</strong></p>

          <p role="status" aria-live="polite">redirecting to PayNova wallet authentication</p>

          {awaitingWebhook ? (

            <p role="status">awaiting PayNova payment confirmation</p>

          ) : (

            <>

              <p>authorise payment with mobile wallet credentials</p>

              <button type="button" onClick={handleAuthorise} disabled={authorising}>

                authorise payment with mobile wallet credentials

              </button>

            </>

          )}

          <p style={{ marginTop: 16 }}>

            <Link to="/checkout/payment">cancel PayNova wallet flow</Link>

            {' · '}

            <span>return to payment method selector</span>

          </p>

        </section>

        <OrderReviewSummary

          cart={cart}

          draft={draft}

          primaryAction={<p>awaiting PayNova authorisation</p>}

        />

      </div>

    </CustomerPage>

  );

}

