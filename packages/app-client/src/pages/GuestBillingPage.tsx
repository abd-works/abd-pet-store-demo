import React, { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import type { BillingAddress } from '@pawplace/order-shared';

import { placeGuestOrder } from '@pawplace/order-client/order.api';

import { CheckoutProgressTabs } from '../components/CheckoutProgressTabs';

import { CustomerPage } from '../components/CustomerPage';

import { useCart } from '../context/CartContext';

import {

  isLegacyCheckoutPath,

  loadCheckoutDraft,

  mergeCheckoutDraft,

  resolveCheckoutPath,

} from '../checkout/checkoutDraft';



const emptyBilling: BillingAddress = {

  name: '',

  addressLine1: '',

  addressLine2: '',

  city: '',

  countyOrRegion: '',

  postcode: '',

  country: 'United Kingdom',

};



export function GuestBillingPage() {

  const navigate = useNavigate();

  const { cart } = useCart();

  const draft = loadCheckoutDraft();

  const checkoutPath = resolveCheckoutPath(draft);

  const [guestEmail, setGuestEmail] = useState(draft.guestEmail ?? '');

  const [guestName, setGuestName] = useState(draft.guestName ?? '');

  const [billingAddress, setBillingAddress] = useState<BillingAddress>(draft.billingAddress ?? emptyBilling);

  const [errors, setErrors] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);



  const updateBilling = (field: keyof BillingAddress, value: string) => {

    setBillingAddress((prev) => ({ ...prev, [field]: value }));

  };



  const validate = (): boolean => {

    const next: string[] = [];

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {

      next.push('invalid guest email');

    }

    if (!guestName.trim()) next.push('name is required');

    if (!billingAddress.addressLine1.trim()) next.push('address line 1 is required');

    if (!billingAddress.city.trim()) next.push('city is required');

    if (!billingAddress.countyOrRegion.trim()) next.push('county/state is required');

    if (!billingAddress.postcode.trim()) next.push('postcode is required');

    if (!billingAddress.country.trim()) next.push('country is required');

    if (isLegacyCheckoutPath(draft) && !draft.pickupStoreCode) next.push('pickup store is required');

    setErrors(next);

    return next.length === 0;

  };



  const handleContinue = async () => {

    if (!validate()) return;



    const normalizedBilling = { ...billingAddress, name: billingAddress.name || guestName };

    mergeCheckoutDraft({ guestEmail, guestName, billingAddress: normalizedBilling });



    if (checkoutPath === 'standard_delivery') {

      navigate('/checkout/shipping');

      return;

    }



    if (checkoutPath === 'click_and_collect') {

      navigate('/checkout/pickup-store');

      return;

    }



    setSubmitting(true);

    try {

      const order = await placeGuestOrder({

        guestEmail,

        guestName,

        billingAddress: normalizedBilling,

        pickupStoreCode: draft.pickupStoreCode!,

      });

      mergeCheckoutDraft({ orderNumber: order.orderNumber });

      navigate('/checkout/payment');

    } catch (err) {

      setErrors([err instanceof Error ? err.message : 'checkout failed']);

    } finally {

      setSubmitting(false);

    }

  };



  const continueLabel =

    checkoutPath === 'standard_delivery'

      ? 'continue to shipping address'

      : checkoutPath === 'click_and_collect'

        ? 'continue to pickup store'

        : 'continue to payment';



  return (

    <CustomerPage title="guest checkout — billing address" wide>

      <CheckoutProgressTabs />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        <section aria-label="guest checkout">

          <p>guest checkout — no login or registration required.</p>

          {errors.length > 0 && (

            <div role="alert" aria-live="polite" style={{ color: '#b00020', marginBottom: 12 }}>

              {errors.map((message) => (

                <p key={message}>{message}</p>

              ))}

            </div>

          )}

          <div style={{ marginBottom: 12 }}>

            <label htmlFor="guest-email">guest email</label>

            <input

              id="guest-email"

              type="email"

              value={guestEmail}

              onChange={(event) => setGuestEmail(event.target.value)}

              style={{ display: 'block', width: '100%', padding: 8 }}

            />

          </div>

          <div style={{ marginBottom: 12 }}>

            <label htmlFor="guest-name">guest name</label>

            <input

              id="guest-name"

              value={guestName}

              onChange={(event) => setGuestName(event.target.value)}

              style={{ display: 'block', width: '100%', padding: 8 }}

            />

          </div>

          <fieldset>

            <legend>billing address</legend>

            {(['name', 'addressLine1', 'addressLine2', 'city', 'countyOrRegion', 'postcode', 'country'] as const).map(

              (field) => (

                <div key={field} style={{ marginBottom: 8 }}>

                  <label htmlFor={`billing-${field}`}>{field === 'name' ? 'billing name' : field}</label>

                  <input

                    id={`billing-${field}`}

                    value={billingAddress[field] ?? ''}

                    onChange={(event) => updateBilling(field, event.target.value)}

                    style={{ display: 'block', width: '100%', padding: 8 }}

                  />

                </div>

              ),

            )}

          </fieldset>

        </section>

        <aside aria-label="order summary" style={{ background: '#fff', border: '1px solid #ddd', padding: 16 }}>

          {draft.pickupStoreName && (

            <p><strong>pickup store:</strong> {draft.pickupStoreName}</p>

          )}

          {draft.shippingAddress && (

            <p><strong>shipping address preview:</strong> {draft.shippingAddress.addressLine1}, {draft.shippingAddress.city}</p>

          )}

          <p><strong>billing address preview:</strong> {billingAddress.addressLine1}, {billingAddress.city}</p>

          <p>cart total: {cart.subtotalFormatted}</p>

          <Link to={checkoutPath === 'standard_delivery' ? '/cart' : checkoutPath === 'click_and_collect' ? '/checkout/delivery-option' : '/checkout/pickup-store'}>

            back

          </Link>

          <button type="button" disabled={submitting} onClick={() => void handleContinue()} style={{ display: 'block', marginTop: 12 }}>

            {continueLabel}

          </button>

        </aside>

      </div>

    </CustomerPage>

  );

}


