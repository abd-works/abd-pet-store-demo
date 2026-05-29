import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { lookupOrderStatus } from '@pawplace/order-client/order.api';

import { CustomerPage } from '../components/CustomerPage';



export function OrderLookupPage() {

  const navigate = useNavigate();

  const [orderNumber, setOrderNumber] = useState('');

  const [guestEmail, setGuestEmail] = useState('');

  const [lookupError, setLookupError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);



  const handleLookup = async () => {

    setLookupError(null);

    setSubmitting(true);

    try {

      await lookupOrderStatus(orderNumber.trim(), guestEmail.trim());

      navigate(`/orders/status/${encodeURIComponent(orderNumber.trim())}`);

    } catch {

      setLookupError("We couldn't find an order matching those details");

    } finally {

      setSubmitting(false);

    }

  };



  return (

    <CustomerPage title="guest order lookup">

      <section aria-label="order lookup form">

        {lookupError && (

          <p role="alert" id="lookup-error" aria-live="polite" style={{ color: '#b00020' }}>

            {lookupError}

          </p>

        )}

        <div style={{ marginBottom: 12, maxWidth: 420 }}>

          <label htmlFor="lookup-order-number">order number</label>

          <input

            id="lookup-order-number"

            value={orderNumber}

            onChange={(event) => setOrderNumber(event.target.value)}

            aria-describedby={lookupError ? 'lookup-error' : undefined}

            style={{ display: 'block', width: '100%', padding: 8 }}

          />

        </div>

        <div style={{ marginBottom: 12, maxWidth: 420 }}>

          <label htmlFor="lookup-guest-email">guest email</label>

          <input

            id="lookup-guest-email"

            type="email"

            value={guestEmail}

            onChange={(event) => setGuestEmail(event.target.value)}

            aria-describedby={lookupError ? 'lookup-error' : undefined}

            style={{ display: 'block', width: '100%', padding: 8 }}

          />

        </div>

        <button type="button" disabled={submitting} onClick={() => void handleLookup()} style={{ padding: '10px 16px' }}>

          look up order

        </button>

      </section>

    </CustomerPage>

  );

}


