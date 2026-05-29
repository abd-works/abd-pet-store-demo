import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { resendVerification, verifyEmailToken } from '@pawplace/customer-account-client';
import { CustomerPage } from '../../components/CustomerPage';

export function VerifyEmailSuccessPage() {
  return (
    <CustomerPage title="verify email — success">
      <p>you&apos;re verified — log in to continue</p>
      <Link to="/login" style={{ display: 'inline-block', marginTop: 12, padding: '10px 16px', background: '#111', color: '#fff' }}>
        log in
      </Link>
    </CustomerPage>
  );
}

export function VerifyEmailExpiredPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    void verifyEmailToken(token).then((result) => {
      if (result.outcome === 'already_verified') {
        setMessage('already verified');
      } else if (result.error) {
        setMessage(result.error);
      }
    });
  }, [token]);

  const handleResend = async () => {
    const email = window.prompt('Enter your email address');
    if (email) await resendVerification(email);
  };

  return (
    <CustomerPage title="verify email — link expired">
      <p>{message ?? 'This verification link has expired'}</p>
      {message === 'already verified' && (
        <p>
          <Link to="/login">log in</Link>
        </p>
      )}
      <button type="button" onClick={handleResend} style={{ marginTop: 12, padding: '10px 16px' }}>
        resend verification
      </button>
    </CustomerPage>
  );
}

export function VerifyEmailHandlerPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [done, setDone] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setDone(true);
      return;
    }
    void verifyEmailToken(token).then((result) => {
      if (result.outcome === 'success' || result.outcome === 'already_verified') {
        setSuccess(true);
      }
      setDone(true);
    }).catch(() => setDone(true));
  }, [token]);

  if (!done) return <CustomerPage title="verify email"><p role="status">Verifying…</p></CustomerPage>;
  if (success) return <VerifyEmailSuccessPage />;
  return <VerifyEmailExpiredPage />;
}
