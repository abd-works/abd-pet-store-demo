import React, { useEffect, useState } from 'react';
import type { SavedPaymentMethodDto } from '@pawplace/customer-account-shared';
import {
  deleteSavedPaymentMethod,
  fetchSavedPaymentMethods,
  setDefaultPaymentMethod,
} from '@pawplace/customer-account-client';
import { CustomerPage } from '../../components/CustomerPage';
import { AccountSettingsLayout } from '../../components/AccountSettingsNav';

export function SavedPaymentMethodsPage() {
  const [methods, setMethods] = useState<SavedPaymentMethodDto[]>([]);
  const [pickDefault, setPickDefault] = useState<string | null>(null);

  const load = async () => {
    setMethods(await fetchSavedPaymentMethods());
  };

  useEffect(() => {
    void load();
  }, []);

  const handleRemove = async (id: string, isDefault: boolean) => {
    if (isDefault && methods.length > 1) {
      setPickDefault(id);
      return;
    }
    await deleteSavedPaymentMethod(id);
    await load();
  };

  const confirmNewDefault = async (removedId: string, newDefaultId: string) => {
    await deleteSavedPaymentMethod(removedId, newDefaultId);
    setPickDefault(null);
    await load();
  };

  return (
    <CustomerPage title="saved payment methods">
      <AccountSettingsLayout>
        <section aria-label="saved payment method list">
          {pickDefault && (
            <div role="dialog" aria-label="select new default payment method">
              <p>select new default payment method</p>
              {methods.filter((m) => m.id !== pickDefault).map((method) => (
                <button key={method.id} type="button" onClick={() => void confirmNewDefault(pickDefault, method.id)}>
                  {method.cardType} •••• {method.lastFour}
                </button>
              ))}
            </div>
          )}
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {methods.map((method) => (
              <li
                key={method.id}
                style={{
                  marginBottom: 12,
                  padding: 12,
                  border: '1px solid #ddd',
                  opacity: method.isExpired ? 0.5 : 1,
                }}
              >
                <p>
                  {method.cardType} •••• {method.lastFour} — expiry {method.expiryMonth}/{method.expiryYear}
                </p>
                {method.isDefault && <span>default payment method indicator</span>}
                {method.isExpired && <span> expired saved payment method</span>}
                <div style={{ marginTop: 8 }}>
                  <button type="button" aria-label="remove payment method" onClick={() => void handleRemove(method.id, method.isDefault)}>
                    remove payment method
                  </button>{' '}
                  {!method.isDefault && !method.isExpired && (
                    <button type="button" onClick={() => void setDefaultPaymentMethod(method.id).then(load)}>
                      set as default payment method
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </AccountSettingsLayout>
    </CustomerPage>
  );
}
