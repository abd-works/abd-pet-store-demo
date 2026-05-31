import React from 'react';
import { useParams } from 'react-router-dom';
import { PetProfileForm } from '@pawplace/customer-account-client';
import { CustomerPage } from '../../components/CustomerPage';
import { AccountSettingsLayout } from '../../components/AccountSettingsNav';
import { useCustomerSession } from '../../context/CustomerSessionContext';

export function EditPetProfilePage() {
  const { petId } = useParams<{ petId: string }>();
  const { isLoggedIn, isVerified } = useCustomerSession();
  const isNew = petId === 'new';

  return (
    <CustomerPage title={isNew ? 'add pet profile' : 'edit pet profile'}>
      <AccountSettingsLayout>
        <PetProfileForm isLoggedIn={isLoggedIn} isVerified={isVerified} />
      </AccountSettingsLayout>
    </CustomerPage>
  );
}
