import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { SavedAddressDto } from '@pawplace/customer-account-shared';
import {
  deleteSavedAddress,
  fetchSavedAddresses,
  setDefaultAddress,
} from '@pawplace/customer-account-client';
import { CustomerPage } from '../../components/CustomerPage';
import { AccountSettingsLayout } from '../../components/AccountSettingsNav';

export function AddressBookPage() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<SavedAddressDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pickDefault, setPickDefault] = useState<string | null>(null);

  const load = async () => {
    setAddresses(await fetchSavedAddresses());
  };

  useEffect(() => {
    void load();
  }, []);

  const handleDelete = async (id: string, isDefault: boolean) => {
    setError(null);
    try {
      if (isDefault && addresses.length > 1) {
        setPickDefault(id);
        return;
      }
      await deleteSavedAddress(id);
      await load();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const confirmNewDefault = async (deletedId: string, newDefaultId: string) => {
    await deleteSavedAddress(deletedId, newDefaultId);
    setPickDefault(null);
    await load();
  };

  return (
    <CustomerPage title="address book">
      <AccountSettingsLayout>
        <section aria-label="saved address list">
          {error && <p role="alert">{error}</p>}
          {pickDefault && (
            <div role="dialog" aria-label="select new default address">
              <p>select new default address</p>
              {addresses.filter((a) => a.id !== pickDefault).map((addr) => (
                <button key={addr.id} type="button" onClick={() => void confirmNewDefault(pickDefault, addr.id)}>
                  {addr.label ?? addr.addressLine1}
                </button>
              ))}
            </div>
          )}
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {addresses.map((addr) => (
              <li key={addr.id} style={{ marginBottom: 12, padding: 12, border: '1px solid #ddd' }}>
                <p>{addr.recipientName} — {addr.addressLine1}, {addr.city}</p>
                {addr.isDefault && <span>default address indicator</span>}
                <div style={{ marginTop: 8 }}>
                  <Link to={`/account/addresses/${addr.id}/edit`}>edit</Link>{' '}
                  <button type="button" aria-label="delete address" onClick={() => void handleDelete(addr.id, addr.isDefault)}>
                    delete address
                  </button>{' '}
                  {!addr.isDefault && (
                    <button type="button" onClick={() => void setDefaultAddress(addr.id).then(load)}>
                      set as default address
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => navigate('/account/addresses/new/edit')}>add address</button>
        </section>
      </AccountSettingsLayout>
    </CustomerPage>
  );
}
