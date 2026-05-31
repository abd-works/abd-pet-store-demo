import React, { useCallback, useEffect, useState } from 'react';
import {
  fetchNotificationPreferences,
  toggleNotificationPreference,
  type NotificationPreferencesDto,
} from './preferences.api';
import {
  NotificationPreferencesGuestGate,
  NotificationPreferencesPanel,
} from './NotificationPreferencesPanel';

export interface NotificationPreferencesViewProps {
  isLoggedIn: boolean;
  isVerified: boolean;
}

export function NotificationPreferencesView({ isLoggedIn, isVerified }: NotificationPreferencesViewProps) {
  const [prefs, setPrefs] = useState<NotificationPreferencesDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const showGuestGate = !isLoggedIn || !isVerified;

  const load = useCallback(async () => {
    if (showGuestGate) return;
    try {
      setPrefs(await fetchNotificationPreferences());
      setError(null);
    } catch {
      setError('Unable to load notification preferences');
    }
  }, [showGuestGate]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleToggle = async (category: string, enabled: boolean) => {
    if (!prefs) return;
    const prior = prefs;
    setPrefs({
      ...prefs,
      categories: prefs.categories.map((item) =>
        item.category === category ? { ...item, enabled } : item,
      ),
    });
    try {
      setPrefs(await toggleNotificationPreference({ category, enabled }));
      setError(null);
    } catch {
      setPrefs(prior);
      setError('Unable to save notification preference');
    }
  };

  return (
    <NotificationPreferencesPanel
      prefs={prefs}
      error={error}
      onToggle={(category, enabled) => void handleToggle(category, enabled)}
      guestGate={showGuestGate ? <NotificationPreferencesGuestGate /> : undefined}
    />
  );
}
