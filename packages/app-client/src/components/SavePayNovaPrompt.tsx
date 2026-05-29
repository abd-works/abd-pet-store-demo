import React from 'react';

interface SavePayNovaPromptProps {
  onSave: () => void;
  onDismiss: () => void;
}

export function SavePayNovaPrompt({ onSave, onDismiss }: SavePayNovaPromptProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="save-paynova-title"
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
        <h2 id="save-paynova-title" style={{ fontSize: 18 }}>
          save PayNova as saved payment method for future orders
        </h2>
        <p>only PayNova vendor token stored — not wallet secrets</p>
        <button type="button" onClick={onSave} style={{ marginRight: 8 }}>
          save PayNova wallet
        </button>
        <button type="button" onClick={onDismiss}>
          not now
        </button>
      </div>
    </div>
  );
}
