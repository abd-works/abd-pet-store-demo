import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export interface PreferenceGuestGateProps {
  message: string;
  createAccountLabel?: string;
  extraNote?: React.ReactNode;
}

export function PreferenceGuestGate({
  message,
  createAccountLabel = 'Register',
  extraNote,
}: PreferenceGuestGateProps) {
  const { pathname } = useLocation();
  const returnTo = encodeURIComponent(pathname);

  return (
    <div data-testid="preference-guest-gate">
      <p>{message}</p>
      {extraNote}
      <p>
        <Link to={`/login?returnTo=${returnTo}`}>Log In</Link>
        {' · '}
        <Link to={`/register?returnTo=${returnTo}`}>{createAccountLabel}</Link>
      </p>
    </div>
  );
}
