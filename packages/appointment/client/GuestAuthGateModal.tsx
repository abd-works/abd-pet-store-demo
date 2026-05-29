import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface GuestAuthGateModalProps {
  petId: string;
  onClose: () => void;
}

export function GuestAuthGateModal({ petId, onClose }: GuestAuthGateModalProps) {
  const navigate = useNavigate();
  const headingId = 'auth-gate-heading';
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dialogRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSignIn = () => {
    navigate(`/login?returnTo=${encodeURIComponent(`/pets/${petId}/book/slots`)}`);
  };

  const handleRegister = () => {
    navigate(`/register?returnTo=${encodeURIComponent(`/pets/${petId}/book/slots`)}`);
  };

  return (
    <>
      <div
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100 }}
        onClick={onClose}
        aria-hidden="true"
        inert
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        tabIndex={-1}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#fff',
          borderRadius: 12,
          padding: 32,
          maxWidth: 400,
          width: '90%',
          zIndex: 101,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        <h2 id={headingId} style={{ fontSize: 18, marginBottom: 12 }}>
          appointments require a customer account
        </h2>
        <p aria-live="polite" style={{ fontSize: 13, color: '#555', marginBottom: 20 }}>
          your selected slot is held for 10 minutes
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={handleSignIn}
            style={{ flex: 1, padding: '10px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={handleRegister}
            style={{ flex: 1, padding: '10px 16px', background: '#fff', color: '#333', border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer' }}
          >
            Register
          </button>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close auth gate"
          style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888' }}
        >
          ×
        </button>
      </div>
    </>
  );
}
