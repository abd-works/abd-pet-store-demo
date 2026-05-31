import React from 'react';
import { CommunicationPreferencesView } from '@pawplace/customer-account-client';
import { CustomerPage } from '../../components/CustomerPage';
import { AccountSettingsLayout } from '../../components/AccountSettingsNav';
import { useCustomerSession } from '../../context/CustomerSessionContext';

export function CommunicationPreferencesPage() {
  const { isLoggedIn, isVerified } = useCustomerSession();

  return (
    <CustomerPage title="customer account — communication preferences">
      <AccountSettingsLayout>
        <CommunicationPreferencesView isLoggedIn={isLoggedIn} isVerified={isVerified} />
      </AccountSettingsLayout>
    </CustomerPage>
  );
}
