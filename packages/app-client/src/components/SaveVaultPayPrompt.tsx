import React from 'react';

interface SaveVaultPayPromptProps {
  onSave: () => void;
  onDismiss: () => void;
}

export function SaveVaultPayPrompt({ onSave, onDismiss }: SaveVaultPayPromptProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="save-vaultpay-title"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ background: '#fff', padding: 24, maxWidth: 420 }}>
        <h2 id="save-vaultpay-title" style={{ fontSize: 18 }}>
          save VaultPay as saved payment method for future orders
        </h2>
        <p>
          future VaultPay checkout pre-fills identity but requires eligibility check per transaction
        </p>
        <button type="button" onClick={onSave} style={{ marginRight: 8 }}>
          save VaultPay identity
        </button>
        <button type="button" onClick={onDismiss}>
          not now
        </button>
      </div>
    </div>
  );
}
