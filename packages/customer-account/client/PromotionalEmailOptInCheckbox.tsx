import React from 'react';
import { PROMOTIONAL_EMAIL_OPT_IN_LABEL } from './preference-labels';

export interface PromotionalEmailOptInCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
}

/** Unchecked by default — affirmative opt-in only (Opt In to Marketing Email List AC 2). */
export function PromotionalEmailOptInCheckbox({
  checked,
  onChange,
  id = 'promotional-email-opt-in',
}: PromotionalEmailOptInCheckboxProps) {
  return (
    <div style={{ marginTop: 12, marginBottom: 12 }}>
      <label htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-checked={checked}
        />
        {' '}
        {PROMOTIONAL_EMAIL_OPT_IN_LABEL}
      </label>
    </div>
  );
}
