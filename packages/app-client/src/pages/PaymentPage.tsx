import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import type { SavedPaymentMethodDto } from '@pawplace/customer-account-shared';

import type { PaymentVendor } from '@pawplace/payment-shared';

import { payOrder, startVendorPayment, type PaymentErrorBody } from '@pawplace/payment-client/payment.api';

import { fetchSavedPaymentMethods } from '@pawplace/customer-account-client';

import { CheckoutProgressTabs } from '../components/CheckoutProgressTabs';

import { CustomerPage } from '../components/CustomerPage';

import { OrderReviewSummary } from '../components/OrderReviewSummary';

import { useCart } from '../context/CartContext';

import { useCustomerSession } from '../context/CustomerSessionContext';

import { clearCheckoutDraft, loadCheckoutDraft } from '../checkout/checkoutDraft';



const VENDOR_OPTIONS: { id: PaymentVendor; label: string }[] = [

  { id: 'stripewave', label: 'StripeWave — card' },

  { id: 'paynova', label: 'PayNova — digital wallet' },

  { id: 'vaultpay', label: 'VaultPay — buy-now-pay-later' },

];



function savedPaymentDisplayLabel(method: SavedPaymentMethodDto): string {

  if (method.vendor === 'paynova') return 'PayNova wallet — saved payment method';

  if (method.vendor === 'vaultpay') return 'VaultPay — saved payment method';

  const defaultSuffix = method.isDefault ? ' — StripeWave default' : '';

  return `${method.cardType} •••• ${method.lastFour}${defaultSuffix}`;

}



function savedPaymentAriaLabel(method: SavedPaymentMethodDto): string {

  return savedPaymentDisplayLabel(method);

}



function expiredPaymentDisplayLabel(method: SavedPaymentMethodDto): string {

  if (method.vendor === 'paynova') return 'PayNova wallet — saved payment method';

  if (method.vendor === 'vaultpay') return 'VaultPay — saved payment method';

  return `•••• ${method.lastFour}`;

}



export function PaymentMethodSelectorPage() {

  const navigate = useNavigate();

  const { cart, refreshCart } = useCart();

  const { isVerified } = useCustomerSession();

  const draft = loadCheckoutDraft();

  const [selectedVendor, setSelectedVendor] = useState<PaymentVendor>('stripewave');

  const [savedMethods, setSavedMethods] = useState<SavedPaymentMethodDto[]>([]);

  const [selectedMethodId, setSelectedMethodId] = useState('');

  const [useDifferentPayment, setUseDifferentPayment] = useState(false);

  const [processing, setProcessing] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [saveForFuture, setSaveForFuture] = useState(false);



  useEffect(() => {

    if (!isVerified) return;

    void fetchSavedPaymentMethods().then((methods) => {

      setSavedMethods(methods);

      const defaultMethod = methods.find((m) => m.isDefault && !m.isExpired) ?? methods.find((m) => !m.isExpired);

      if (defaultMethod) setSelectedMethodId(defaultMethod.id);

    });

  }, [isVerified]);



  const activeMethods = savedMethods.filter((m) => !m.isExpired);

  const expiredMethods = savedMethods.filter((m) => m.isExpired);

  const showSavedSelection = isVerified && savedMethods.length > 0 && !useDifferentPayment;



  const handleContinue = async () => {

    const activeDraft = loadCheckoutDraft();

    if (!activeDraft.orderNumber) return;



    if (showSavedSelection) {

      const selected = savedMethods.find((m) => m.id === selectedMethodId);

      if (!selected || selected.isExpired) {

        setError('expired saved payment method cannot be charged');

        return;

      }



      setProcessing(true);

      setError(null);

      try {

        const order = await payOrder(activeDraft.orderNumber, {

          savedPaymentMethodId: selectedMethodId,

        });

        clearCheckoutDraft();

        await refreshCart();

        navigate(`/order-confirmation/${order.orderNumber}`);

      } catch (err) {

        const paymentErr = err as Error & { body?: PaymentErrorBody };

        if (paymentErr.body?.hardDecline) {

          setError(paymentErr.body.error ?? 'payment declined');

          return;

        }

        if (paymentErr.body?.retrying) {

          navigate('/checkout/payment/retrying');

          return;

        }

        if (paymentErr.body?.retryExhausted || paymentErr.body?.restoreSelector) {

          navigate('/checkout/payment/retry-exhausted');

          return;

        }

        setError(paymentErr.message);

      } finally {

        setProcessing(false);

      }

      return;

    }



    if (selectedVendor === 'stripewave') {

      navigate('/checkout/payment/stripewave');

      return;

    }



    setProcessing(true);

    try {

      await startVendorPayment(activeDraft.orderNumber, selectedVendor);

      navigate(`/checkout/payment/${selectedVendor}`);

    } catch (err) {

      const paymentErr = err as Error & { body?: PaymentErrorBody };

      if (paymentErr.body?.hardDecline) {

        navigate(

          selectedVendor === 'paynova'

            ? '/checkout/payment/paynova/declined'

            : '/checkout/payment/vaultpay/declined',

        );

        return;

      }

      setError(paymentErr.message);

    } finally {

      setProcessing(false);

    }

  };



  const pageTitle = showSavedSelection

    ? 'logged-in checkout — payment method selector'

    : 'guest checkout — payment method selector';



  return (

    <CustomerPage title={pageTitle} wide>

      <CheckoutProgressTabs />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        <section aria-label="payment">

          {showSavedSelection ? (

            <>

              <fieldset aria-label="saved payment method selection">

                <legend>saved payment method selection</legend>

                {activeMethods.map((method) => (

                  <label key={method.id} style={{ display: 'block', marginBottom: 8 }}>

                    <input

                      type="radio"

                      name="saved-payment"

                      value={method.id}

                      checked={selectedMethodId === method.id}

                      onChange={() => setSelectedMethodId(method.id)}

                      aria-label={savedPaymentAriaLabel(method)}

                    />{' '}

                    {savedPaymentDisplayLabel(method)}

                  </label>

                ))}

                {expiredMethods.map((method) => (

                  <p key={method.id} aria-disabled="true">

                    {expiredPaymentDisplayLabel(method)} — expired saved payment method

                  </p>

                ))}

                <button type="button" onClick={() => setUseDifferentPayment(true)}>

                  use a different payment method

                </button>

              </fieldset>

              <label htmlFor="save-payment-checkout" style={{ display: 'block', marginTop: 12 }}>

                <input

                  id="save-payment-checkout"

                  type="checkbox"

                  checked={saveForFuture}

                  onChange={(e) => setSaveForFuture(e.target.checked)}

                />{' '}

                save this payment method for future orders

              </label>

            </>

          ) : (

            <>

              <fieldset aria-label="payment method selector">

                <legend>payment method selector</legend>

                {VENDOR_OPTIONS.map((option) => (

                  <label key={option.id} style={{ display: 'block', marginBottom: 8 }}>

                    <input

                      type="radio"

                      name="payment-vendor"

                      value={option.id}

                      checked={selectedVendor === option.id}

                      onChange={() => setSelectedVendor(option.id)}

                      aria-checked={selectedVendor === option.id}

                    />{' '}

                    {option.label}

                  </label>

                ))}

              </fieldset>

              <p id="payment-method-hint">

                StripeWave and PayNova and VaultPay remain selectable after cancel

              </p>

            </>

          )}

          {useDifferentPayment && isVerified && (

            <>

              <fieldset aria-label="payment method selector" style={{ marginTop: 16 }}>

                <legend>payment method selector</legend>

                {VENDOR_OPTIONS.map((option) => (

                  <label key={option.id} style={{ display: 'block', marginBottom: 8 }}>

                    <input

                      type="radio"

                      name="payment-vendor-logged-in"

                      value={option.id}

                      checked={selectedVendor === option.id}

                      onChange={() => setSelectedVendor(option.id)}

                    />{' '}

                    {option.label}

                  </label>

                ))}

              </fieldset>

              <label htmlFor="save-payment-checkout" style={{ display: 'block', marginTop: 12 }}>

                <input

                  id="save-payment-checkout"

                  type="checkbox"

                  checked={saveForFuture}

                  onChange={(e) => setSaveForFuture(e.target.checked)}

                />{' '}

                save this payment method for future orders

              </label>

            </>

          )}

          {error && (

            <p role="alert" style={{ color: '#b00020' }}>

              {error}

            </p>

          )}

        </section>

        <OrderReviewSummary

          cart={cart}

          draft={draft}

          primaryAction={

            <button

              type="button"

              disabled={processing || !loadCheckoutDraft().orderNumber}

              onClick={handleContinue}

              style={{ display: 'block', marginTop: 12, padding: '10px 16px' }}

            >

              {showSavedSelection ? 'confirm order' : 'continue with selected payment method'}

            </button>

          }

        />

      </div>

    </CustomerPage>

  );

}



/** @deprecated use PaymentMethodSelectorPage — kept for test imports */

export const PaymentPage = PaymentMethodSelectorPage;

