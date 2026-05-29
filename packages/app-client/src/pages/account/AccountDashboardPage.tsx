import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomerSession } from '../../context/CustomerSessionContext';
import { CustomerPage } from '../../components/CustomerPage';
import { AccountSettingsLayout } from '../../components/AccountSettingsNav';

export function AccountDashboardPage() {
  const { account, logout, logoutAllDevices } = useCustomerSession();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleLogoutEverywhere = async () => {
    await logoutAllDevices();
    navigate('/');
  };

  return (
    <CustomerPage title="account dashboard">
      <AccountSettingsLayout>
        <section aria-label="account overview">
          <p><strong>customer account email:</strong> {account?.email}</p>
          <p><strong>account verification status:</strong> {account?.accountVerificationStatus}</p>
          <button type="button" onClick={handleLogout} style={{ marginRight: 8, marginTop: 12, padding: '8px 12px' }}>
            log out
          </button>
          <button type="button" onClick={handleLogoutEverywhere} style={{ marginTop: 12, padding: '8px 12px' }}>
            log out everywhere
          </button>
        </section>
      </AccountSettingsLayout>
    </CustomerPage>
  );
}
