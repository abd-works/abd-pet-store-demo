import React, { useCallback, useEffect, useState } from 'react';

import type { CommunicationPreferencesDto, MarketingCategory } from '@pawplace/customer-account-shared';

import {

  fetchCommunicationPreferences,

  toggleCommunicationPreference,

} from './preferences.api';

import {

  CommunicationPreferencesGuestGate,

  CommunicationPreferencesPanel,

} from './CommunicationPreferencesPanel';



export interface CommunicationPreferencesViewProps {

  isLoggedIn: boolean;

  isVerified: boolean;

}



export function CommunicationPreferencesView({ isLoggedIn, isVerified }: CommunicationPreferencesViewProps) {

  const [prefs, setPrefs] = useState<CommunicationPreferencesDto | null>(null);

  const [error, setError] = useState<string | null>(null);

  const showGuestGate = !isLoggedIn || !isVerified;



  const load = useCallback(async () => {

    if (showGuestGate) return;

    try {

      setPrefs(await fetchCommunicationPreferences());

      setError(null);

    } catch {

      setError('Unable to load communication preferences');

    }

  }, [showGuestGate]);



  useEffect(() => {

    void load();

  }, [load]);



  const handleToggle = async (category: MarketingCategory, optedIn: boolean) => {

    if (!prefs) return;

    const prior = prefs;

    const nextCategories = prefs.categories.map((item) =>
      item.category === category
        ? { ...item, status: optedIn ? ('opted-in' as const) : ('opted-out' as const) }
        : item,
    );
    const optimistic: CommunicationPreferencesDto = {
      ...prefs,
      categories: nextCategories,
      onMarketingEmailList: nextCategories.some((item) => item.status === 'opted-in'),
    };

    setPrefs(optimistic);

    try {

      setPrefs(await toggleCommunicationPreference({ category, optedIn }));

      setError(null);

    } catch {

      setPrefs(prior);

      setError('Unable to save communication preference');

    }

  };



  return (

    <CommunicationPreferencesPanel

      prefs={prefs}

      error={error}

      onToggle={(category, optedIn) => void handleToggle(category, optedIn)}

      guestGate={showGuestGate ? <CommunicationPreferencesGuestGate /> : undefined}

    />

  );

}

