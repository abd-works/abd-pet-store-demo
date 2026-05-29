import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { resendVerification } from '@pawplace/customer-account-client';
import { useCustomerSession } from '../../context/CustomerSessionContext';
import { CustomerPage } from '../../components/CustomerPage';
import { useCart } from '../../context/CartContext';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useCustomerSession();
  const { refreshCart } = useCart();
  const returnUrl = (location.state as { returnUrl?: string } | null)?.returnUrl ?? '/account';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showResend, setShowResend] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setShowResend(false);
    try {
      await login(email, password);
      await refreshCart();
      navigate(returnUrl);
    } catch (err) {
      const apiErr = err as Error & { status?: number; body?: { error?: string; resendAvailable?: boolean } };
      setError(apiErr.body?.error ?? apiErr.message);
      if (apiErr.body?.resendAvailable) setShowResend(true);
    }
  };

  const handleResend = async () => {
    await resendVerification(email);
    setError('expect verification email shortly');
  };

  return (
    <CustomerPage title="log in">
      <form aria-label="login form" onSubmit={handleSubmit}>
        {error && (
          <p role="alert" id="login-error" aria-live="polite" style={{ color: '#b00020' }}>
            {error}
          </p>
        )}
        {showResend && (
          <button type="button" onClick={handleResend} style={{ marginBottom: 12 }}>
            resend verification
          </button>
        )}
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="login-email">email address</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-describedby={error ? 'login-error' : undefined}
            style={{ display: 'block', width: '100%', maxWidth: 400, padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="login-password">password</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ display: 'block', width: '100%', maxWidth: 400, padding: 8 }}
          />
        </div>
        <button type="submit" style={{ marginTop: 12, padding: '10px 16px' }}>
          log in
        </button>
        <p style={{ marginTop: 12 }}>
          <Link to="/reset-password">forgot password</Link>
        </p>
        <p>
          <Link to="/register">register</Link>
        </p>
      </form>
    </CustomerPage>
  );
}
