import React from 'react';
import { MyPetsView } from '@pawplace/customer-account-client';
import { CustomerPage } from '../../components/CustomerPage';
import { AccountSettingsLayout } from '../../components/AccountSettingsNav';

export function MyPetsPage() {
  return (
    <CustomerPage title="customer account — my pets">
      <AccountSettingsLayout>
        <MyPetsView />
      </AccountSettingsLayout>
    </CustomerPage>
  );
}
