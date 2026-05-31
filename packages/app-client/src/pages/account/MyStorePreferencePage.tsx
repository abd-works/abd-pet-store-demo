import React from 'react';
import { MyStorePreferenceView } from '@pawplace/customer-account-client';
import { CustomerPage } from '../../components/CustomerPage';
import { AccountSettingsLayout } from '../../components/AccountSettingsNav';
import { useCustomerSession } from '../../context/CustomerSessionContext';

export function MyStorePreferencePage() {
  const { isLoggedIn, isVerified } = useCustomerSession();

  return (
    <CustomerPage title="customer account — my store">
      <AccountSettingsLayout>
        <MyStorePreferenceView isLoggedIn={isLoggedIn} isVerified={isVerified} />
      </AccountSettingsLayout>
    </CustomerPage>
  );
}
