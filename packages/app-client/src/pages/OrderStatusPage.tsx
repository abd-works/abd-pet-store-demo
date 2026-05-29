import React, { useEffect, useState } from 'react';

import { Link, useParams, useSearchParams } from 'react-router-dom';

import type { OrderStatusDto } from '@pawplace/order-shared';

import { fetchOrderStatus } from '@pawplace/order-client/order.api';

import { CustomerPage } from '../components/CustomerPage';



export function OrderStatusPage() {

  const { orderNumber } = useParams<{ orderNumber: string }>();

  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState<OrderStatusDto | null>(null);

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    if (!orderNumber) return;

    const token = searchParams.get('token') ?? undefined;

    fetchOrderStatus(orderNumber, token)

      .then(setStatus)

      .catch(() => setStatus(null))

      .finally(() => setLoading(false));

  }, [orderNumber, searchParams]);



  if (loading) {

    return (

      <CustomerPage title="order status page">

        <p>Loading order status…</p>

      </CustomerPage>

    );

  }



  if (!status) {

    return (

      <CustomerPage title="order status page">

        <p>We couldn't find an order matching those details</p>

        <Link to="/orders/lookup">try guest order lookup</Link>

      </CustomerPage>

    );

  }



  return (

    <CustomerPage title="order status page">

      <section aria-label="order status header">

        <p><strong>order number:</strong> {status.orderNumber}</p>

        <p><strong>order status:</strong> {status.statusLabel}</p>

      </section>



      <section aria-label="order line item list" style={{ marginTop: 24 }}>

        <h2 style={{ fontSize: 16 }}>order line item list</h2>

        <ul>

          {status.lineItems.map((item) => (

            <li key={item.sku}>

              {item.name} × {item.quantity} — £{item.lineTotal.toFixed(2)}

            </li>

          ))}

        </ul>

      </section>



      <section aria-label="delivery details" style={{ marginTop: 24 }}>

        <h2 style={{ fontSize: 16 }}>delivery details</h2>

        <p><strong>delivery option:</strong> {status.deliveryOptionLabel}</p>

        {status.shippingAddress ? (

          <p>

            <strong>shipping address:</strong> {status.shippingAddress.addressLine1}, {status.shippingAddress.city}{' '}

            {status.shippingAddress.postcode}

          </p>

        ) : status.pickupStore ? (

          <p>

            <strong>pickup store:</strong> {status.pickupStore.storeName}, {status.pickupStore.addressLineOne},{' '}

            {status.pickupStore.city} {status.pickupStore.postcode}

          </p>

        ) : null}

        {status.shippingCostFormatted && <p>shipping cost: {status.shippingCostFormatted}</p>}

        {status.estimatedDeliveryWindow && (

          <p>estimated delivery window: {status.estimatedDeliveryWindow}</p>

        )}

      </section>



      <section aria-label="tracking section" style={{ marginTop: 24 }}>

        <h2 style={{ fontSize: 16 }}>tracking section</h2>

        {status.tracking ? (

          <>

            <p>

              <strong>tracking number:</strong>{' '}

              <a href={status.tracking.carrierTrackingUrl} target="_blank" rel="noreferrer">

                {status.tracking.number} ({status.tracking.carrierName})

              </a>

            </p>

            <p>shipment date: {new Date(status.tracking.shippedAt).toLocaleDateString()}</p>

            {status.tracking.estimatedDeliveryDate && (

              <p>estimated delivery date: {status.tracking.estimatedDeliveryDate}</p>

            )}

          </>

        ) : (

          <p role="status">{status.trackingPendingMessage ?? 'Tracking will be available once your order ships'}</p>

        )}

      </section>



      <Link

        to="/product-catalog"

        style={{

          display: 'inline-block',

          marginTop: 24,

          padding: '10px 16px',

          background: '#111',

          color: '#fff',

          textDecoration: 'none',

          borderRadius: 4,

        }}

      >

        continue shopping

      </Link>

    </CustomerPage>

  );

}


