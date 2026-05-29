import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PASSWORD_REQUIREMENT_LABELS } from '@pawplace/customer-account-shared';
import { confirmPasswordReset, validateResetToken } from '@pawplace/customer-account-client';
import { CustomerPage } from '../../components/CustomerPage';

export function ResetPasswordSetPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [valid, setValid] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) {
      setValid(false);
      return;
    }
    void validateResetToken(token).then(setValid);
  }, [token]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await confirmPasswordReset(token, password, passwordConfirmation);
      setDone(true);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (valid === null) {
    return (
      <CustomerPage title="reset password — set new password">
        <p role="status">Validating reset link…</p>
      </CustomerPage>
    );
  }

  if (valid === false) {
    return (
      <CustomerPage title="reset password — set new password">
        <p>link expired — request new reset</p>
        <Link to="/reset-password">Request new reset</Link>
      </CustomerPage>
    );
  }

  if (done) {
    return (
      <CustomerPage title="reset password — set new password">
        <p role="status">password updated — please log in again</p>
        <Link to="/login">log in</Link>
      </CustomerPage>
    );
  }

  return (
    <CustomerPage title="reset password — set new password">
      <form onSubmit={handleSubmit}>
        <p id="reset-password-requirements">password requirements: {PASSWORD_REQUIREMENT_LABELS.join(' · ')}</p>
        {error && <p role="alert" style={{ color: '#b00020' }}>{error}</p>}
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="new-password">new password</label>
          <input id="new-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} aria-describedby="reset-password-requirements" style={{ display: 'block', width: '100%', maxWidth: 400, padding: 8 }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="confirm-new-password">confirm password</label>
          <input id="confirm-new-password" type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} style={{ display: 'block', width: '100%', maxWidth: 400, padding: 8 }} />
        </div>
        <button type="submit" style={{ padding: '10px 16px' }}>update password</button>
      </form>
    </CustomerPage>
  );
}
