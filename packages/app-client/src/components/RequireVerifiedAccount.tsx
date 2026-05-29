import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useCustomerSession } from '../context/CustomerSessionContext';

export function RequireVerifiedAccount({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isVerified, loading } = useCustomerSession();
  const location = useLocation();

  if (loading) return <p role="status">Loading account…</p>;
  if (!isLoggedIn || !isVerified) {
    return <Navigate to="/login" state={{ returnUrl: location.pathname }} replace />;
  }
  return <>{children}</>;
}
