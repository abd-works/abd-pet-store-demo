import React, { useEffect, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { fetchStores, fetchStoresNearby, type StoreResponse } from '@pawplace/store-client/store.api';

import { placeGuestOrder } from '@pawplace/order-client/order.api';

import { CheckoutProgressTabs } from '../components/CheckoutProgressTabs';

import { CustomerPage } from '../components/CustomerPage';

import { useCart } from '../context/CartContext';

import { isLegacyCheckoutPath, loadCheckoutDraft, mergeCheckoutDraft } from '../checkout/checkoutDraft';



export function PickupStoreSelectionPage() {

  const navigate = useNavigate();

  const { cart } = useCart();

  const draft = loadCheckoutDraft();

  const legacyFlow = isLegacyCheckoutPath(draft);

  const [stores, setStores] = useState<StoreResponse[]>([]);

  const [postcode, setPostcode] = useState('');

  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  const [locationNote, setLocationNote] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);



  useEffect(() => {

    fetchStores().then(setStores);

  }, []);



  const selectedStore = stores.find((store) => store.storeCode === selectedCode);



  const handleShareLocation = () => {

    if (!navigator.geolocation) {

      setLocationNote('Enter a postcode or share location to sort stores by distance.');

      return;

    }

    navigator.geolocation.getCurrentPosition(async (position) => {

      const nearby = await fetchStoresNearby(position.coords.latitude, position.coords.longitude);

      if (nearby) {

        setStores(nearby);

        setLocationNote(null);

      }

    });

  };



  const handleContinue = async () => {

    if (!selectedStore) return;

    mergeCheckoutDraft({

      pickupStoreCode: selectedStore.storeCode,

      pickupStoreName: selectedStore.storeName,

      pickupStoreAddress: `${selectedStore.addressLineOne}, ${selectedStore.city} ${selectedStore.postcode}`,

    });



    if (legacyFlow) {

      navigate('/checkout/billing');

      return;

    }



    if (!draft.guestEmail || !draft.billingAddress) {

      setError('Complete billing address first.');

      return;

    }



    setSubmitting(true);

    setError(null);

    try {

      const order = await placeGuestOrder({

        guestEmail: draft.guestEmail,

        guestName: draft.guestName ?? draft.guestEmail,

        billingAddress: draft.billingAddress,

        deliveryOption: {

          type: 'click_and_collect',

          pickupStoreCode: selectedStore.storeCode,

        },

        pickupStoreCode: selectedStore.storeCode,

      });

      mergeCheckoutDraft({ orderNumber: order.orderNumber });

      navigate('/checkout/payment');

    } catch (err) {

      setError(err instanceof Error ? err.message : 'checkout failed');

    } finally {

      setSubmitting(false);

    }

  };



  return (

    <CustomerPage title="click-and-collect store selection" wide>

      <CheckoutProgressTabs />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        <section aria-label="pickup store selection">

          {legacyFlow && (

            <fieldset>

              <legend>click-and-collect (sole delivery option)</legend>

              <p>Delivery: click-and-collect only — no shipping address required.</p>

            </fieldset>

          )}

          {error && <p role="alert" style={{ color: '#b00020' }}>{error}</p>}

          <div style={{ marginTop: 16 }}>

            <label htmlFor="checkout-postcode">postcode</label>

            <input

              id="checkout-postcode"

              value={postcode}

              onChange={(event) => setPostcode(event.target.value)}

              style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }}

            />

            {locationNote && <p role="status">{locationNote}</p>}

            <button type="button" onClick={handleShareLocation} style={{ marginRight: 8 }}>

              share location

            </button>

            <button type="button" onClick={() => { setPostcode(''); fetchStores().then(setStores); }}>

              clear location

            </button>

          </div>

          <ul data-testid="pickup-store-list" style={{ listStyle: 'none', padding: 0, marginTop: 16 }}>

            {stores.map((store) => (

              <li key={store.storeCode} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 8 }}>

                <strong>{store.storeName}</strong>

                <div>{store.addressLineOne}, {store.city} {store.postcode}</div>

                <div>operating hours: Mon–Sat 9:00–18:00</div>

                {store.distance_km != null && <div>distance: {store.distance_km} km</div>}

                <button type="button" onClick={() => setSelectedCode(store.storeCode)} style={{ marginTop: 8 }}>

                  select pickup store

                </button>

              </li>

            ))}

          </ul>

        </section>

        <aside aria-label="checkout summary" style={{ background: '#fff', border: '1px solid #ddd', padding: 16 }}>

          {selectedStore ? (

            <>

              <p><strong>pickup store name:</strong> {selectedStore.storeName}</p>

              <p><strong>pickup store address:</strong> {selectedStore.addressLineOne}, {selectedStore.city}</p>

            </>

          ) : (

            <p>Select a pickup store to continue.</p>

          )}

          <p>cart total: {cart.subtotalFormatted}</p>

          <Link to={legacyFlow ? '/cart' : '/checkout/billing'}>back</Link>

          <button

            type="button"

            disabled={!selectedStore || submitting}

            onClick={() => void handleContinue()}

            style={{ display: 'block', marginTop: 12, padding: '10px 16px' }}

          >

            {legacyFlow ? 'continue to billing address' : 'continue to payment'}

          </button>

        </aside>

      </div>

    </CustomerPage>

  );

}


