import React from 'react';

interface ReorderFeedbackBannerProps {
  skippedSkus: string[];
  stockWarnings: string[];
  onDismiss: () => void;
}

export function ReorderFeedbackBanner({ skippedSkus, stockWarnings, onDismiss }: ReorderFeedbackBannerProps) {
  if (skippedSkus.length === 0 && stockWarnings.length === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      data-testid="reorder-feedback"
      style={{ background: '#fff3cd', border: '1px solid #ffc107', padding: 12, marginBottom: 16 }}
    >
      {skippedSkus.length > 0 && (
        <p>partial reorder — product could not be added: {skippedSkus.join(', ')}</p>
      )}
      {stockWarnings.map((warning) => (
        <p key={warning}>stock availability warning on line item — {warning}</p>
      ))}
      <button type="button" onClick={onDismiss}>dismiss reorder feedback</button>
    </div>
  );
}
