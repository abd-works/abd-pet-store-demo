import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export interface SetMyStoreGuestModalProps {
  open: boolean;
  onClose: () => void;
}

export function SetMyStoreGuestModal({ open, onClose }: SetMyStoreGuestModalProps) {
  const { pathname } = useLocation();
  const returnTo = encodeURIComponent(pathname);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="set-my-store-guest-title"
      data-testid="set-my-store-guest-modal"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div style={{ background: '#fff', padding: 24, maxWidth: 420, borderRadius: 4 }}>
        <h2 id="set-my-store-guest-title" style={{ fontSize: 18, marginTop: 0 }}>
          log in or register to set my store
        </h2>
        <p style={{ marginBottom: 16 }}>
          Set as My Store requires a logged-in customer account.
        </p>
        <p>
          <Link to={`/login?returnTo=${returnTo}`}>Log In</Link>
          {' · '}
          <Link to={`/register?returnTo=${returnTo}`}>Register</Link>
        </p>
        <button type="button" onClick={onClose} style={{ marginTop: 16 }}>
          close
        </button>
      </div>
    </div>
  );
}
