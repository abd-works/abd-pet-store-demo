import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { SavedAddressDto } from '@pawplace/customer-account-shared';
import type { ShippingAddress } from '@pawplace/order-shared';
import {
  ShippingAddress as ShippingAddressDomain,
  validateShippingAddressFields,
} from '@pawplace/order-shared';
import { fetchSavedAddresses, saveAddress } from '@pawplace/customer-account-client';
import { CheckoutProgressTabs } from '../components/CheckoutProgressTabs';
import { CustomerPage } from '../components/CustomerPage';
import { useCart } from '../context/CartContext';
import { useCustomerSession } from '../context/CustomerSessionContext';
import { loadCheckoutDraft, mergeCheckoutDraft } from '../checkout/checkoutDraft';

const emptyShipping: ShippingAddress = {
  recipientName: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  countyOrRegion: '',
  postcode: '',
  country: 'United Kingdom',
};

function savedToShipping(saved: SavedAddressDto): ShippingAddress {
  return {
    recipientName: saved.recipientName,
    addressLine1: saved.addressLine1,
    addressLine2: saved.addressLine2 ?? '',
    city: saved.city,
    countyOrRegion: saved.countyOrRegion ?? '',
    postcode: saved.postcode,
    country: saved.country,
  };
}

export function ShippingAddressPage() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const { isVerified } = useCustomerSession();
  const draft = loadCheckoutDraft();
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>(draft.shippingAddress ?? emptyShipping);
  const [errors, setErrors] = useState<string[]>([]);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddressDto[]>([]);
  const [selectedSavedId, setSelectedSavedId] = useState<string>('');
  const [useDifferentAddress, setUseDifferentAddress] = useState(false);
  const [saveForFuture, setSaveForFuture] = useState(false);

  useEffect(() => {
    if (!isVerified) return;
    void fetchSavedAddresses().then((list) => {
      setSavedAddresses(list);
      const defaultAddr = list.find((a) => a.isDefault) ?? list[0];
      if (defaultAddr) {
        setSelectedSavedId(defaultAddr.id);
        setShippingAddress(savedToShipping(defaultAddr));
      }
    });
  }, [isVerified]);

  const updateField = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSameAsBilling = (checked: boolean) => {
    setSameAsBilling(checked);
    if (checked && draft.billingAddress) {
      setShippingAddress(ShippingAddressDomain.preFillFromBilling(draft.billingAddress));
    }
  };

  const handleSavedSelection = (id: string) => {
    setSelectedSavedId(id);
    const selected = savedAddresses.find((a) => a.id === id);
    if (selected) setShippingAddress(savedToShipping(selected));
  };

  const validate = (): boolean => {
    const next = validateShippingAddressFields(shippingAddress);
    setErrors(next);
    return next.length === 0;
  };

  const handleContinue = async () => {
    if (!validate()) return;
    if (isVerified && saveForFuture && useDifferentAddress) {
      await saveAddress({
        recipientName: shippingAddress.recipientName,
        addressLine1: shippingAddress.addressLine1,
        addressLine2: shippingAddress.addressLine2,
        city: shippingAddress.city,
        countyOrRegion: shippingAddress.countyOrRegion,
        postcode: shippingAddress.postcode,
        country: shippingAddress.country,
      });
    }
    mergeCheckoutDraft({ shippingAddress });
    navigate('/checkout/delivery-option');
  };

  const showLoggedInSaved = isVerified && savedAddresses.length > 0 && !useDifferentAddress;
  const pageTitle =
    isVerified && savedAddresses.length > 0
      ? 'logged-in checkout — saved address'
      : 'guest checkout — shipping address';

  return (
    <CustomerPage title={pageTitle} wide>
      <CheckoutProgressTabs />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <section aria-label="shipping address">
          {showLoggedInSaved ? (
            <>
              <fieldset aria-label="saved address selection">
                <legend>saved address selection</legend>
                {savedAddresses.map((addr) => (
                  <label key={addr.id} style={{ display: 'block', marginBottom: 8 }}>
                    <input
                      type="radio"
                      name="saved-address"
                      value={addr.id}
                      checked={selectedSavedId === addr.id}
                      onChange={() => handleSavedSelection(addr.id)}
                      aria-label={addr.label ?? addr.addressLine1}
                    />{' '}
                    {addr.label ?? addr.addressLine1}
                    {addr.isDefault ? ' — default address' : ''}
                  </label>
                ))}
                <input
                  aria-label="selected saved address line 1"
                  readOnly
                  value={shippingAddress.addressLine1}
                  style={{ display: 'block', width: '100%', padding: 8, marginTop: 8, marginBottom: 12 }}
                />
                <button type="button" onClick={() => setUseDifferentAddress(true)}>
                  use a different address
                </button>
              </fieldset>
              <label htmlFor="save-address-checkout" style={{ display: 'block', marginTop: 12 }}>
                <input
                  id="save-address-checkout"
                  type="checkbox"
                  checked={saveForFuture}
                  onChange={(e) => setSaveForFuture(e.target.checked)}
                />{' '}
                save this address for future orders
              </label>
              <p aria-label="selected saved address preview">
                selected saved address preview: {shippingAddress.addressLine1}, {shippingAddress.city}
              </p>
            </>
          ) : (
            <>
              {errors.length > 0 && (
                <div role="alert" aria-live="polite" id="shipping-validation" style={{ color: '#b00020', marginBottom: 12 }}>
                  {errors.map((message) => (
                    <p key={message}>{message}</p>
                  ))}
                </div>
              )}
              {!isVerified && (
                <aside aria-label="guest account prompt" style={{ marginBottom: 16, padding: 12, background: '#f5f5f5' }}>
                  <p>log in or register for saved address benefit</p>
                  <Link to="/login">log in</Link>{' '}
                  <Link to="/register">register</Link>
                </aside>
              )}
              <label htmlFor="same-as-billing" style={{ display: 'block', marginBottom: 16 }}>
                <input
                  id="same-as-billing"
                  type="checkbox"
                  checked={sameAsBilling}
                  onChange={(event) => handleSameAsBilling(event.target.checked)}
                />{' '}
                same as billing
              </label>
              <fieldset>
                <legend>shipping address</legend>
                {(
                  [
                    ['recipientName', 'recipient name'],
                    ['addressLine1', 'address line 1'],
                    ['addressLine2', 'address line 2 (optional)'],
                    ['city', 'city'],
                    ['countyOrRegion', 'county or region'],
                    ['postcode', 'postcode'],
                    ['country', 'country'],
                  ] as const
                ).map(([field, label]) => (
                  <div key={field} style={{ marginBottom: 8 }}>
                    <label htmlFor={`shipping-${field}`}>{label}</label>
                    <input
                      id={`shipping-${field}`}
                      value={shippingAddress[field] ?? ''}
                      onChange={(event) => updateField(field, event.target.value)}
                      aria-describedby={errors.length > 0 ? 'shipping-validation' : undefined}
                      style={{ display: 'block', width: '100%', padding: 8 }}
                    />
                  </div>
                ))}
              </fieldset>
              {isVerified && useDifferentAddress && (
                <label htmlFor="save-address-future" style={{ display: 'block', marginTop: 12 }}>
                  <input
                    id="save-address-future"
                    type="checkbox"
                    checked={saveForFuture}
                    onChange={(e) => setSaveForFuture(e.target.checked)}
                  />{' '}
                  save this address for future orders
                </label>
              )}
            </>
          )}
        </section>
        <aside aria-label="order summary" style={{ background: '#fff', border: '1px solid #ddd', padding: 16 }}>
          <p><strong>shipping address preview:</strong> {shippingAddress.addressLine1}, {shippingAddress.city}</p>
          <p><strong>billing address preview:</strong> {draft.billingAddress?.addressLine1}, {draft.billingAddress?.city}</p>
          <p>cart total: {cart.subtotalFormatted}</p>
          <Link to="/checkout/billing">back</Link>
          <button type="button" onClick={() => void handleContinue()} style={{ display: 'block', marginTop: 12, padding: '10px 16px' }}>
            continue to delivery option
          </button>
        </aside>
      </div>
    </CustomerPage>
  );
}
