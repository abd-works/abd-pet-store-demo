import React from 'react';
import { Link } from 'react-router-dom';

interface GuestWishlistPromptProps {
  onDismiss: () => void;
}

export function GuestWishlistPrompt({ onDismiss }: GuestWishlistPromptProps) {
  return (
    <div
      role="dialog"
      aria-label="wishlist — guest prompt"
      aria-modal="true"
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
      <div style={{ background: '#fff', padding: 24, maxWidth: 400, borderRadius: 8 }}>
        <p>wishlist requires verified customer account</p>
        <Link to="/login" style={{ marginRight: 12 }}>log in</Link>
        <Link to="/register" style={{ marginRight: 12 }}>register</Link>
        <button type="button" onClick={onDismiss}>dismiss</button>
      </div>
    </div>
  );
}
