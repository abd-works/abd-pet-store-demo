import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { CommunicationPreferencesDto, MarketingCategory } from '@pawplace/customer-account-shared';
import {
  MARKETING_CATEGORIES,
  MARKETING_CATEGORY_DESCRIPTIONS,
  MARKETING_CATEGORY_LABELS,
} from '@pawplace/customer-account-shared';
import { TRANSACTIONAL_NOTE } from './preference-labels';

export interface CommunicationPreferencesPanelProps {
  prefs: CommunicationPreferencesDto | null;
  error: string | null;
  onToggle: (category: MarketingCategory, optedIn: boolean) => void;
  guestGate?: React.ReactNode;
}

export function CommunicationPreferencesGuestGate() {
  const { pathname } = useLocation();
  const returnTo = encodeURIComponent(pathname);

  return (
    <div data-testid="preference-guest-gate">
      <p>Log in or register to manage communication preferences</p>
      <p>
        <Link to={`/login?returnTo=${returnTo}`}>Log In</Link>
        {' · '}
        <Link to={`/register?returnTo=${returnTo}`}>Register</Link>
      </p>
    </div>
  );
}

function CategoryToggleRow({
  category,
  checked,
  onToggle,
}: {
  category: MarketingCategory;
  checked: boolean;
  onToggle: (optedIn: boolean) => void;
}) {
  const inputId = `comm-pref-${category}`;
  return (
    <li style={{ marginBottom: 12 }}>
      <label htmlFor={inputId}>
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          aria-checked={checked}
          onChange={(e) => onToggle(e.target.checked)}
        />
        {' '}
        {MARKETING_CATEGORY_LABELS[category]}
      </label>
      <p style={{ margin: '4px 0 0 24px', fontSize: 14, color: '#555' }}>
        {MARKETING_CATEGORY_DESCRIPTIONS[category]}
      </p>
    </li>
  );
}

export function CommunicationPreferencesPanel({
  prefs,
  error,
  onToggle,
  guestGate,
}: CommunicationPreferencesPanelProps) {
  if (guestGate) {
    return <>{guestGate}</>;
  }

  const categories = prefs?.categories ?? [];
  const knownCategories = new Set(categories.map((c) => c.category));

  return (
    <div data-testid="communication-preferences-panel">
      <h1>Marketing Communication Preferences</h1>
      <p>Changes take effect immediately</p>
      {error && (
        <p role="alert" aria-live="assertive">
          {error}
        </p>
      )}
      <ul style={{ listStyle: 'none', padding: 0 }} aria-label="marketing category toggles">
        {categories.map((item) => (
          <CategoryToggleRow
            key={item.category}
            category={item.category}
            checked={item.status === 'opted-in'}
            onToggle={(optedIn) => onToggle(item.category, optedIn)}
          />
        ))}
        {MARKETING_CATEGORIES.filter((c) => !knownCategories.has(c)).map((category) => (
          <CategoryToggleRow
            key={category}
            category={category}
            checked={false}
            onToggle={(optedIn) => onToggle(category, optedIn)}
          />
        ))}
      </ul>
      <p>{TRANSACTIONAL_NOTE}</p>
      {prefs?.onMarketingEmailList && (
        <p data-testid="marketing-email-list-status">Marketing Email List: member</p>
      )}
    </div>
  );
}
