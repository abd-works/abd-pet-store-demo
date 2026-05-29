import React, { createContext, useContext, useMemo, useState } from 'react';
import type { BillingAddress } from '@pawplace/order-shared';
import type { StoreResponse } from '@pawplace/store-client/store.api';

interface CheckoutDraft {
  pickupStore: StoreResponse | null;
  guestEmail: string;
  guestName: string;
  billingAddress: BillingAddress;
  orderNumber: string | null;
}

interface CheckoutContextValue extends CheckoutDraft {
  setPickupStore: (store: StoreResponse | null) => void;
  setGuestContact: (guestEmail: string, guestName: string) => void;
  setBillingAddress: (billingAddress: BillingAddress) => void;
  setOrderNumber: (orderNumber: string | null) => void;
  resetCheckout: () => void;
}

const defaultBilling: BillingAddress = {
  name: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  countyOrRegion: '',
  postcode: '',
  country: '',
};

const CheckoutContext = createContext<CheckoutContextValue | undefined>(undefined);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [pickupStore, setPickupStore] = useState<StoreResponse | null>(null);
  const [guestEmail, setGuestEmail] = useState('');
  const [guestName, setGuestName] = useState('');
  const [billingAddress, setBillingAddress] = useState<BillingAddress>(defaultBilling);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const value = useMemo(
    () => ({
      pickupStore,
      guestEmail,
      guestName,
      billingAddress,
      orderNumber,
      setPickupStore,
      setGuestContact: (email: string, name: string) => {
        setGuestEmail(email);
        setGuestName(name);
      },
      setBillingAddress,
      setOrderNumber,
      resetCheckout: () => {
        setPickupStore(null);
        setGuestEmail('');
        setGuestName('');
        setBillingAddress(defaultBilling);
        setOrderNumber(null);
      },
    }),
    [pickupStore, guestEmail, guestName, billingAddress, orderNumber],
  );

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export function useCheckout(): CheckoutContextValue {
  const context = useContext(CheckoutContext);
  if (!context) throw new Error('useCheckout must be used within CheckoutProvider');
  return context;
}
