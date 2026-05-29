import React, { useEffect, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import {

  DeliveryOption,

  STANDARD_DELIVERY_COST_PENCE,

  STANDARD_DELIVERY_WINDOW,

} from '@pawplace/order-shared';

import { placeGuestOrder } from '@pawplace/order-client/order.api';

import { fetchStores, fetchStoresNearby, type StoreResponse } from '@pawplace/store-client/store.api';

import { CheckoutProgressTabs } from '../components/CheckoutProgressTabs';

import { CustomerPage } from '../components/CustomerPage';

import { useCart } from '../context/CartContext';

import { loadCheckoutDraft, mergeCheckoutDraft, resolveCheckoutPath } from '../checkout/checkoutDraft';



export function DeliveryOptionPage() {

  const navigate = useNavigate();

  const { cart } = useCart();

  const draft = loadCheckoutDraft();

  const checkoutPath = resolveCheckoutPath(draft);

  const [selected, setSelected] = useState<'standard_delivery' | 'click_and_collect'>(

    draft.deliveryOption ?? 'standard_delivery',

  );

  const [stores, setStores] = useState<StoreResponse[]>([]);

  const [postcode, setPostcode] = useState('');

  const [selectedStoreCode, setSelectedStoreCode] = useState<string | null>(draft.pickupStoreCode ?? null);

  const [locationNote, setLocationNote] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);



  useEffect(() => {

    if (selected === 'click_and_collect') {

      fetchStores().then(setStores);

    }

  }, [selected]);



  const selectedStore = stores.find((store) => store.storeCode === selectedStoreCode);

  const shippingCostFormatted = DeliveryOption.formatShippingCost(STANDARD_DELIVERY_COST_PENCE);

  const hasShippingStep = checkoutPath === 'standard_delivery' && Boolean(draft.shippingAddress);



  const handleSwitch = (option: 'standard_delivery' | 'click_and_collect') => {

    setSelected(option);

    mergeCheckoutDraft({

      deliveryOption: option,

      checkoutPath: option,

      ...(option === 'standard_delivery' ? { pickupStoreCode: undefined, pickupStoreName: undefined } : { shippingAddress: undefined }),

    });

  };



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



  const continueLabel = (): string => {

    if (selected === 'standard_delivery' && hasShippingStep) return 'continue to payment';

    if (selected === 'click_and_collect' && !draft.billingAddress) return 'continue to billing address';

    if (selected === 'click_and_collect') return 'continue to pickup store';

    return 'continue to billing address';

  };



  const handleContinue = async () => {

    setError(null);

    if (selected === 'standard_delivery') {

      if (hasShippingStep) {

        if (!draft.guestEmail || !draft.billingAddress || !draft.shippingAddress) {

          setError('Complete billing and shipping steps first.');

          return;

        }

        setSubmitting(true);

        try {

          const order = await placeGuestOrder({

            guestEmail: draft.guestEmail,

            guestName: draft.guestName ?? draft.guestEmail,

            billingAddress: draft.billingAddress,

            shippingAddress: draft.shippingAddress,

            deliveryOption: DeliveryOption.standardDelivery(),

          });

          mergeCheckoutDraft({ orderNumber: order.orderNumber, deliveryOption: 'standard_delivery' });

          navigate('/checkout/payment');

        } catch (err) {

          setError(err instanceof Error ? err.message : 'checkout failed');

        } finally {

          setSubmitting(false);

        }

        return;

      }

      mergeCheckoutDraft({ deliveryOption: 'standard_delivery', checkoutPath: 'standard_delivery' });

      navigate('/checkout/billing');

      return;

    }



    if (!selectedStore) {

      setError('Select a pickup store to continue.');

      return;

    }

    mergeCheckoutDraft({

      deliveryOption: 'click_and_collect',

      checkoutPath: 'click_and_collect',

      pickupStoreCode: selectedStore.storeCode,

      pickupStoreName: selectedStore.storeName,

      pickupStoreAddress: `${selectedStore.addressLineOne}, ${selectedStore.city} ${selectedStore.postcode}`,

    });

    if (draft.billingAddress && draft.guestEmail) {

      navigate('/checkout/pickup-store');

    } else {

      navigate('/checkout/billing');

    }

  };



  return (

    <CustomerPage title="delivery option selection" wide>

      <CheckoutProgressTabs />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        <section aria-label="delivery option">

          {error && (

            <p role="alert" style={{ color: '#b00020' }}>{error}</p>

          )}

          <fieldset>

            <legend>delivery option</legend>

            <label style={{ display: 'block', marginBottom: 12 }}>

              <input

                type="radio"

                name="delivery-option"

                checked={selected === 'standard_delivery'}

                onChange={() => handleSwitch('standard_delivery')}

              />{' '}

              standard delivery — {STANDARD_DELIVERY_WINDOW} — shipping cost {shippingCostFormatted}

            </label>

            <label style={{ display: 'block', marginBottom: 12 }}>

              <input

                type="radio"

                name="delivery-option"

                checked={selected === 'click_and_collect'}

                onChange={() => handleSwitch('click_and_collect')}

              />{' '}

              click-and-collect (free)

            </label>

          </fieldset>



          {selected === 'standard_delivery' && hasShippingStep && (

            <div style={{ marginTop: 16 }}>

              <p><strong>estimated delivery window:</strong> {STANDARD_DELIVERY_WINDOW}</p>

              <p><strong>shipping cost:</strong> {shippingCostFormatted}</p>

              <p><strong>shipping address confirmation:</strong> {draft.shippingAddress?.addressLine1}, {draft.shippingAddress?.city} {draft.shippingAddress?.postcode}</p>

            </div>

          )}



          {selected === 'click_and_collect' && (

            <>

              <div style={{ marginTop: 16 }}>

                <label htmlFor="delivery-postcode">postcode</label>

                <input

                  id="delivery-postcode"

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

                    <button type="button" onClick={() => setSelectedStoreCode(store.storeCode)} style={{ marginTop: 8 }}>

                      select pickup store

                    </button>

                  </li>

                ))}

              </ul>

            </>

          )}

        </section>

        <aside aria-label="checkout summary" style={{ background: '#fff', border: '1px solid #ddd', padding: 16 }}>

          <p><strong>delivery option:</strong> {selected === 'standard_delivery' ? 'standard delivery' : 'click-and-collect'}</p>

          {selected === 'standard_delivery' && hasShippingStep && (

            <p><strong>shipping address:</strong> {draft.shippingAddress?.addressLine1}, {draft.shippingAddress?.city}</p>

          )}

          {selected === 'click_and_collect' && selectedStore && (

            <p><strong>pickup store:</strong> {selectedStore.storeName}</p>

          )}

          <p>cart total: {cart.subtotalFormatted}</p>

          {selected === 'standard_delivery' && (

            <p>shipping cost: {shippingCostFormatted}</p>

          )}

          <Link to={hasShippingStep ? '/checkout/shipping' : '/cart'}>back</Link>

          <button

            type="button"

            disabled={submitting || (selected === 'click_and_collect' && !selectedStore)}

            onClick={() => void handleContinue()}

            style={{ display: 'block', marginTop: 12, padding: '10px 16px' }}

          >

            {continueLabel()}

          </button>

        </aside>

      </div>

    </CustomerPage>

  );

}


