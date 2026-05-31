import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PASSWORD_REQUIREMENT_LABELS } from '@pawplace/customer-account-shared';
import { registerAccount } from '@pawplace/customer-account-client';
import { CustomerPage } from '../../components/CustomerPage';
import { PromotionalEmailOptInCheckbox } from '../../components/PromotionalEmailOptInCheckbox';

export function RegisterPage() {
  const navigate = useNavigate();
  const [optInPromotionalEmail, setOptInPromotionalEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await registerAccount({
        email,
        password,
        passwordConfirmation,
        firstName,
        lastName,
        optInPromotionalEmail,
      });
      navigate('/register/confirmation', { state: { email } });
    } catch (err) {
      const apiErr = err as Error & { body?: { error?: string; loginUrl?: string } };
      setError(apiErr.body?.error ?? apiErr.message);
    }
  };

  return (
    <CustomerPage title="register account">
      <form aria-label="registration form" onSubmit={handleSubmit}>
        <fieldset>
          <legend>registration form</legend>
          <p id="password-requirements">
            password requirements: {PASSWORD_REQUIREMENT_LABELS.join(' · ')}
          </p>
          {error && (
            <p role="alert" aria-live="polite" style={{ color: '#b00020' }}>
              {error}
              {error.includes('already in use') && (
                <>
                  {' '}
                  <Link to="/login">Log In instead</Link>
                </>
              )}
            </p>
          )}
          {(
            [
              ['email', 'email address', email, setEmail],
              ['password', 'password', password, setPassword],
              ['passwordConfirmation', 'confirm password', passwordConfirmation, setPasswordConfirmation],
              ['firstName', 'first name', firstName, setFirstName],
              ['lastName', 'last name', lastName, setLastName],
            ] as const
          ).map(([id, label, value, setter]) => (
            <div key={id} style={{ marginBottom: 8 }}>
              <label htmlFor={id}>{label}</label>
              <input
                id={id}
                type={id.includes('password') ? 'password' : id === 'email' ? 'email' : 'text'}
                value={value}
                onChange={(e) => setter(e.target.value)}
                aria-describedby={id === 'password' ? 'password-requirements' : error ? undefined : undefined}
                style={{ display: 'block', width: '100%', maxWidth: 400, padding: 8 }}
              />
            </div>
          ))}
          <PromotionalEmailOptInCheckbox
            checked={optInPromotionalEmail}
            onChange={setOptInPromotionalEmail}
          />
          <button type="submit" style={{ marginTop: 12, padding: '10px 16px' }}>
            create account
          </button>
        </fieldset>
      </form>
    </CustomerPage>
  );
}
