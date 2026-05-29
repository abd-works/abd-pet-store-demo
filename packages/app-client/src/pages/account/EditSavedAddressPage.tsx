import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { SavedAddressInput } from '@pawplace/customer-account-shared';
import { fetchSavedAddresses, saveAddress, updateSavedAddress } from '@pawplace/customer-account-client';
import { CustomerPage } from '../../components/CustomerPage';

const emptyAddress: SavedAddressInput = {
  recipientName: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  countyOrRegion: '',
  postcode: '',
  country: 'United Kingdom',
  label: '',
};

export function EditSavedAddressPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const [form, setForm] = useState<SavedAddressInput>(emptyAddress);

  useEffect(() => {
    if (isNew || !id) return;
    void fetchSavedAddresses().then((list) => {
      const found = list.find((a) => a.id === id);
      if (found) {
        setForm({
          recipientName: found.recipientName,
          addressLine1: found.addressLine1,
          addressLine2: found.addressLine2,
          city: found.city,
          countyOrRegion: found.countyOrRegion,
          postcode: found.postcode,
          country: found.country,
          label: found.label,
        });
      }
    });
  }, [id, isNew]);

  const update = (field: keyof SavedAddressInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (isNew) {
      await saveAddress(form);
    } else if (id) {
      await updateSavedAddress(id, form);
    }
    navigate('/account/addresses');
  };

  return (
    <CustomerPage title="edit saved address">
      <form aria-label="edit saved address" onSubmit={(e) => { e.preventDefault(); void handleSave(); }}>
        {(
          [
            ['recipientName', 'recipient name'],
            ['addressLine1', 'address line 1'],
            ['addressLine2', 'address line 2 (optional)'],
            ['city', 'city'],
            ['postcode', 'postcode'],
            ['country', 'country'],
            ['label', 'label (optional)'],
          ] as const
        ).map(([field, label]) => (
          <div key={field} style={{ marginBottom: 8 }}>
            <label htmlFor={`addr-${field}`}>{label}</label>
            <input
              id={`addr-${field}`}
              value={form[field] ?? ''}
              onChange={(e) => update(field, e.target.value)}
              style={{ display: 'block', width: '100%', maxWidth: 400, padding: 8 }}
            />
          </div>
        ))}
        <Link to="/account/addresses" style={{ marginRight: 12 }}>cancel</Link>
        <button type="submit" style={{ padding: '10px 16px' }}>save address</button>
      </form>
    </CustomerPage>
  );
}
