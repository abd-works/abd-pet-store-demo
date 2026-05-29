import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '@pawplace/customer-account-client';
import { CustomerPage } from '../../components/CustomerPage';

export function ResetPasswordRequestPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await requestPasswordReset(email);
    setSubmitted(true);
  };

  return (
    <CustomerPage title="reset password — request">
      {submitted ? (
        <p role="status">check your email</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label htmlFor="reset-email">email address</label>
          <input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ display: 'block', width: '100%', maxWidth: 400, padding: 8, marginBottom: 12 }}
          />
          <button type="submit" style={{ padding: '10px 16px' }}>send reset link</button>
        </form>
      )}
      <p style={{ marginTop: 16 }}><Link to="/login">log in</Link></p>
    </CustomerPage>
  );
}
