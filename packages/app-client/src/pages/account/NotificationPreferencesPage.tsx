import React from 'react';
import { NotificationPreferencesView } from '@pawplace/customer-account-client';
import { CustomerPage } from '../../components/CustomerPage';
import { AccountSettingsLayout } from '../../components/AccountSettingsNav';
import { useCustomerSession } from '../../context/CustomerSessionContext';

export function NotificationPreferencesPage() {
  const { isLoggedIn, isVerified } = useCustomerSession();

  return (
    <CustomerPage title="customer account — notification preferences">
      <AccountSettingsLayout>
        <NotificationPreferencesView isLoggedIn={isLoggedIn} isVerified={isVerified} />
      </AccountSettingsLayout>
    </CustomerPage>
  );
}
