import React, { useEffect, useState } from 'react';

import { Link, useParams } from 'react-router-dom';

import type { OrderDto } from '@pawplace/order-shared';

import { DEFAULT_CARRIER_NAME } from '@pawplace/order-shared';

import {

  addOrderTrackingNumber,

  fetchOrder,

  markOrderFulfilled,

} from '@pawplace/order-client/order.api';

import { StaffPage } from '../components/CustomerPage';



export function ShipToHomeOrderDetailPage() {

  const { orderNumber } = useParams<{ orderNumber: string }>();

  const [order, setOrder] = useState<OrderDto | null>(null);

  const [carrierName, setCarrierName] = useState(DEFAULT_CARRIER_NAME);

  const [trackingNumber, setTrackingNumber] = useState('');

  const [fulfillmentWarning, setFulfillmentWarning] = useState<string | null>(null);

  const [busy, setBusy] = useState(false);



  const reload = () => {

    if (!orderNumber) return;

    void fetchOrder(orderNumber).then(setOrder);

  };



  useEffect(reload, [orderNumber]);



  const handleMarkFulfilled = async () => {

    if (!orderNumber) return;

    setBusy(true);

    setFulfillmentWarning(null);

    try {

      const result = await markOrderFulfilled(orderNumber, {

        carrierName: trackingNumber.trim() ? carrierName : undefined,

        trackingNumber: trackingNumber.trim() || undefined,

      });

      setOrder(result.order);

      if (result.warning) setFulfillmentWarning(result.warning);

    } finally {

      setBusy(false);

    }

  };



  const handleAddTracking = async () => {

    if (!orderNumber || !trackingNumber.trim()) return;

    setBusy(true);

    setFulfillmentWarning(null);

    try {

      const updated = await addOrderTrackingNumber(orderNumber, {

        carrierName,

        trackingNumber: trackingNumber.trim(),

      });

      setOrder(updated);

    } finally {

      setBusy(false);

    }

  };



  if (!order) {

    return (

      <StaffPage title="ship-to-home order detail">

        <p>Loading…</p>

      </StaffPage>

    );

  }



  return (

    <StaffPage title="ship-to-home order detail">

      <p><strong>order number:</strong> {order.orderNumber}</p>

      <p><strong>order status:</strong> {order.status}</p>

      <p><strong>guest email:</strong> {order.guestEmail}</p>

      {order.shippingAddress && (

        <p>

          <strong>shipping address:</strong> {order.shippingAddress.recipientName},{' '}

          {order.shippingAddress.addressLine1}, {order.shippingAddress.city} {order.shippingAddress.postcode}

        </p>

      )}



      <ul aria-label="order line item list">

        {order.items.map((item) => (

          <li key={item.sku}>{item.name} × {item.quantity}</li>

        ))}

      </ul>



      {order.stockWarnings?.map((warning) => (

        <p key={warning.sku} role="alert" style={{ color: '#b00020' }}>

          stock warning: {warning.message}

        </p>

      ))}



      <section aria-label="tracking entry" style={{ marginTop: 16 }}>

        <div style={{ marginBottom: 8 }}>

          <label htmlFor="carrier-name">carrier name</label>

          <input

            id="carrier-name"

            value={carrierName}

            onChange={(event) => setCarrierName(event.target.value)}

            style={{ display: 'block', width: '100%', maxWidth: 320, padding: 8 }}

          />

        </div>

        <div style={{ marginBottom: 8 }}>

          <label htmlFor="tracking-number">tracking number</label>

          <input

            id="tracking-number"

            value={trackingNumber}

            onChange={(event) => setTrackingNumber(event.target.value)}

            aria-describedby={fulfillmentWarning ? 'fulfillment-warning' : undefined}

            style={{ display: 'block', width: '100%', maxWidth: 320, padding: 8 }}

          />

        </div>

        {fulfillmentWarning && (

          <p id="fulfillment-warning" role="alert" style={{ color: '#b00020' }}>

            {fulfillmentWarning}

          </p>

        )}

      </section>



      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>

        {(order.status === 'confirmed' || order.status === 'fulfilled') && (

          <button type="button" onClick={() => void handleMarkFulfilled()} disabled={busy}>

            mark as fulfilled

          </button>

        )}

        {(order.status === 'fulfilled' || order.status === 'confirmed') && trackingNumber.trim() && (

          <button type="button" onClick={() => void handleAddTracking()} disabled={busy}>

            add tracking number

          </button>

        )}

      </div>



      <Link to="/admin/orders" style={{ display: 'inline-block', marginTop: 16 }}>

        back to order queue

      </Link>

    </StaffPage>

  );

}


