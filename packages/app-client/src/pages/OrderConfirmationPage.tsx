import React, { useEffect, useState } from 'react';

import { Link, useParams, useSearchParams, useLocation } from 'react-router-dom';

import type { OrderDto } from '@pawplace/order-shared';

import { fetchOrder } from '@pawplace/order-client/order.api';

import { CustomerPage } from '../components/CustomerPage';
import { SavePayNovaPrompt } from '../components/SavePayNovaPrompt';
import { SaveVaultPayPrompt } from '../components/SaveVaultPayPrompt';
import { saveVendorPaymentMethod } from '@pawplace/customer-account-client';
import { useCustomerSession } from '../context/CustomerSessionContext';



export function OrderConfirmationPage() {

  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const prefilledOrder = (location.state as { order?: OrderDto } | null)?.order;
  const { isVerified } = useCustomerSession();

  const [order, setOrder] = useState<OrderDto | null>(null);

  const [dismissedPrompt, setDismissedPrompt] = useState(false);
  const [showSavePayNova, setShowSavePayNova] = useState(false);
  const [showSaveVaultPay, setShowSaveVaultPay] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);



  useEffect(() => {

    if (!orderNumber) return;

    if (prefilledOrder && prefilledOrder.orderNumber === orderNumber) {
      setOrder(prefilledOrder);
      return;
    }

    fetchOrder(orderNumber).then(setOrder).catch(() => setOrder(null));

  }, [orderNumber, prefilledOrder]);

  useEffect(() => {
    if (searchParams.get('savePayNova') === '1') setShowSavePayNova(true);
    if (searchParams.get('saveVaultPay') === '1') setShowSaveVaultPay(true);
  }, [searchParams]);



  if (!order) {

    return (

      <CustomerPage title="order confirmation page">

        <p>Loading order…</p>

      </CustomerPage>

    );

  }



  const emailStatus =

    order.emailStatus === 'queued' || order.emailStatus === 'failed'

      ? 'confirmation email queued for retry'

      : 'confirmation email sent to guest email';



  const isStandardDelivery = order.deliveryOption?.type === 'standard_delivery';



  return (

    <CustomerPage title="order confirmation page">

      <section aria-label="order confirmation" data-testid="order-confirmation">

        <p><strong>order number:</strong> {order.orderNumber}</p>

        <ul aria-label="order line item list">

          {order.items.map((item) => (

            <li key={item.sku}>{item.name} × {item.quantity} — £{item.lineTotal.toFixed(2)}</li>

          ))}

        </ul>

        <p><strong>total paid:</strong> {order.subtotalFormatted}</p>

        <p><strong>masked payment method:</strong> {order.maskedPaymentMethod ?? 'StripeWave'}</p>

        <p><strong>payment vendor label:</strong> {vendorLabel(order.maskedPaymentMethod)}</p>

        {vendorDetail(order.maskedPaymentMethod, order.vendorTransactionReference)}

        {isStandardDelivery && order.shippingAddress ? (

          <>

            <p>

              <strong>shipping address:</strong> {order.shippingAddress.addressLine1}, {order.shippingAddress.city}{' '}

              {order.shippingAddress.postcode}

            </p>

            {order.shippingCostFormatted && <p>shipping cost: {order.shippingCostFormatted}</p>}

          </>

        ) : order.pickupStore ? (

          <>

            <p>

              <strong>pickup store address:</strong> {order.pickupStore.addressLineOne}, {order.pickupStore.city}{' '}

              {order.pickupStore.postcode}

            </p>

            <p>operating hours: Mon–Sat 9:00–18:00</p>

          </>

        ) : null}

        <p role="status">{emailStatus} — {order.guestEmail}</p>

        {order.statusPageUrl && (

          <p>

            <Link to={order.statusPageUrl}>track your order</Link>

          </p>

        )}

        <Link

          to="/product-catalog"

          style={{

            display: 'inline-block',

            marginTop: 16,

            padding: '10px 16px',

            background: '#111',

            color: '#fff',

            textDecoration: 'none',

            borderRadius: 4,

          }}

        >

          continue shopping

        </Link>

      </section>

      {!dismissedPrompt && (

        <section aria-label="customer account prompt" style={{ marginTop: 32, padding: 16, border: '1px solid #ddd' }}>

          <p>Create a customer account to save your order history and reorder faster.</p>

          <button type="button" style={{ marginRight: 8 }}>create account</button>

          <button type="button" onClick={() => setDismissedPrompt(true)}>dismiss</button>

        </section>

      )}

      {showSavePayNova && (
        <SavePayNovaPrompt
          onSave={() => {
            void saveVendorPaymentMethod({
              vendor: 'paynova',
              vendorToken: `tok_pn_${order.orderNumber}`,
            })
              .then(() => setShowSavePayNova(false))
              .catch((err: Error) => setSaveError(err.message));
          }}
          onDismiss={() => setShowSavePayNova(false)}
        />
      )}

      {showSaveVaultPay && (
        <SaveVaultPayPrompt
          onSave={() => {
            void saveVendorPaymentMethod({
              vendor: 'vaultpay',
              vendorToken: `tok_vp_${order.orderNumber}`,
            })
              .then(() => setShowSaveVaultPay(false))
              .catch((err: Error) => setSaveError(err.message));
          }}
          onDismiss={() => setShowSaveVaultPay(false)}
        />
      )}

      {saveError && (
        <p role="alert" style={{ color: '#b00020', marginTop: 8 }}>
          {saveError}
        </p>
      )}

    </CustomerPage>

  );

}



function vendorLabel(masked?: string | null): string {

  if (!masked) return 'StripeWave';

  if (/paynova/i.test(masked)) return 'PayNova';

  if (/vaultpay/i.test(masked)) return 'VaultPay';

  return 'StripeWave';

}



function vendorDetail(masked?: string | null, vendorTransactionReference?: string): React.ReactNode {

  if (!masked) return null;

  if (/paynova/i.test(masked)) {

    return <p>PayNova vendor transaction reference: {vendorTransactionReference ?? masked}</p>;

  }

  if (/vaultpay/i.test(masked)) {

    return <p>VaultPay instalment reference: {vendorTransactionReference ?? masked}</p>;

  }

  if (/••••/i.test(masked)) {

    return <p>StripeWave last four digits: {masked.split('••••').pop()?.trim()}</p>;

  }

  return null;

}


