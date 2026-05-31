import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { NotificationPreferencesDto } from './preferences.api';
import { CRITICAL_NOTIFICATIONS_NOTE, NOTIFICATION_CATEGORY_LABELS } from './preference-labels';

export interface NotificationPreferencesPanelProps {
  prefs: NotificationPreferencesDto | null;
  error: string | null;
  onToggle: (category: string, enabled: boolean) => void;
  guestGate?: React.ReactNode;
}

export function NotificationPreferencesGuestGate() {
  const { pathname } = useLocation();
  const returnTo = encodeURIComponent(pathname);

  return (
    <div data-testid="preference-guest-gate">
      <p>Log in or create an account</p>
      <p>Guest order notifications continue via checkout email</p>
      <p>
        <Link to={`/login?returnTo=${returnTo}`}>Log In</Link>
        {' · '}
        <Link to={`/register?returnTo=${returnTo}`}>Create Account</Link>
      </p>
    </div>
  );
}

export function NotificationPreferencesPanel({
  prefs,
  error,
  onToggle,
  guestGate,
}: NotificationPreferencesPanelProps) {
  if (guestGate) {
    return <>{guestGate}</>;
  }

  return (
    <div data-testid="notification-preferences-panel">
      <h1>Notification Preferences</h1>
      <p>Changes take effect immediately</p>
      {error && (
        <p role="alert" aria-live="assertive">
          {error}
        </p>
      )}
      {prefs && (
        <>
          <p data-testid="critical-notifications-note">{CRITICAL_NOTIFICATIONS_NOTE}</p>
          <ul style={{ listStyle: 'none', padding: 0 }} aria-label="notification category toggles">
            {prefs.categories.map((item) => (
              <li key={item.category} style={{ marginBottom: 12 }}>
                <label htmlFor={`notif-pref-${item.category}`}>
                  <input
                    id={`notif-pref-${item.category}`}
                    type="checkbox"
                    checked={item.enabled}
                    aria-checked={item.enabled}
                    onChange={(e) => onToggle(item.category, e.target.checked)}
                  />
                  {' '}
                  {NOTIFICATION_CATEGORY_LABELS[item.category] ?? item.category}
                </label>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
