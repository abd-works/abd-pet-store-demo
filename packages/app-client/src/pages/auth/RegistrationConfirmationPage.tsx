import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { resendVerification } from '@pawplace/customer-account-client';
import { CustomerPage } from '../../components/CustomerPage';

export function RegistrationConfirmationPage() {
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email ?? '';
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    if (!email) return;
    await resendVerification(email);
    setResent(true);
  };

  return (
    <CustomerPage title="registration confirmation">
      <section aria-label="email verification pending">
        <p>check your email to verify</p>
        <p>expect verification email shortly</p>
        {resent && <p role="status">expect the email shortly</p>}
        <button type="button" onClick={handleResend} style={{ marginTop: 12, padding: '10px 16px' }}>
          resend verification
        </button>
        <p style={{ marginTop: 16 }}>
          <Link to="/login">log in</Link>
        </p>
      </section>
    </CustomerPage>
  );
}
