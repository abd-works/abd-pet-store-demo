import React from 'react';

export const PROMOTIONAL_EMAIL_OPT_IN_LABEL =
  'Send me promotional emails about sales, new products, and seasonal offers';

export interface PromotionalEmailOptInCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
}

export function PromotionalEmailOptInCheckbox({
  checked,
  onChange,
  id = 'promotional-email-opt-in',
}: PromotionalEmailOptInCheckboxProps) {
  return (
    <label htmlFor={id} style={{ display: 'block', marginTop: 12 }}>
      <input
        id={id}
        data-testid="promotional-email-opt-in"
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      {' '}
      {PROMOTIONAL_EMAIL_OPT_IN_LABEL}
    </label>
  );
}
