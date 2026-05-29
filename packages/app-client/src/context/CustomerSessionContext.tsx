import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { AccountDashboardDto } from '@pawplace/customer-account-shared';
import { fetchCurrentAccount, loginAccount, logoutAccount, logoutEverywhere } from '@pawplace/customer-account-client';

interface CustomerSessionContextValue {
  account: AccountDashboardDto | null;
  loading: boolean;
  isLoggedIn: boolean;
  isVerified: boolean;
  refreshAccount: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  logoutAllDevices: () => Promise<void>;
}

const CustomerSessionContext = createContext<CustomerSessionContextValue | null>(null);

export function CustomerSessionProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<AccountDashboardDto | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAccount = useCallback(async () => {
    try {
      const current = await fetchCurrentAccount();
      setAccount(current);
    } catch {
      setAccount(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshAccount();
  }, [refreshAccount]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const dashboard = await loginAccount({ email, password });
      setAccount(dashboard);
    } catch (err) {
      const apiErr = err as Error & {
        body?: { error?: string; resendAvailable?: boolean };
        response?: { data?: { error?: string; resendAvailable?: boolean } };
      };
      const body = apiErr.body ?? apiErr.response?.data;
      if (body) {
        throw Object.assign(new Error(body.error ?? apiErr.message), { body });
      }
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    await logoutAccount();
    setAccount(null);
  }, []);

  const logoutAllDevices = useCallback(async () => {
    await logoutEverywhere();
    setAccount(null);
  }, []);

  const value = useMemo(
    () => ({
      account,
      loading,
      isLoggedIn: account !== null,
      isVerified: account?.accountVerificationStatus === 'verified',
      refreshAccount,
      login,
      logout,
      logoutAllDevices,
    }),
    [account, loading, refreshAccount, login, logout, logoutAllDevices],
  );

  return <CustomerSessionContext.Provider value={value}>{children}</CustomerSessionContext.Provider>;
}

const defaultGuestSession: CustomerSessionContextValue = {
  account: null,
  loading: false,
  isLoggedIn: false,
  isVerified: false,
  refreshAccount: async () => {},
  login: async () => {},
  logout: async () => {},
  logoutAllDevices: async () => {},
};

export function useCustomerSession(): CustomerSessionContextValue {
  const ctx = useContext(CustomerSessionContext);
  return ctx ?? defaultGuestSession;
}
