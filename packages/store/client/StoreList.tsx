import React, { useMemo, useState } from 'react';
import { useMyStorePreference } from '../../customer-account/client/useMyStorePreference';
import { SplitScreenLayout, StoreDetailPanel, StorePlaceholderPanel } from './store-locator-shared';
import { StoreFilterPanel } from './StoreFilterPanel';
import { StoreListEntries } from './StoreListEntries';
import { StoreLocatorLeftPanel } from './StoreLocatorLeftPanel';
import { StoreLocatorNoMatch } from './StoreLocatorNoMatch';
import { applyStoreFilters, enrichStoreWithSpecializations, type StoreFilterState } from './storeFilterUtils';
import { useStoreLocator } from './useStoreLocator';

export interface StoreListProps {
  isLoggedIn?: boolean;
  isVerified?: boolean;
}

export function StoreList({ isLoggedIn = false, isVerified = false }: StoreListProps) {
  const state = useStoreLocator();
  const { storeCode: preferredStoreCode, save } = useMyStorePreference(isLoggedIn, isVerified);
  const [filters, setFilters] = useState<StoreFilterState>({});

  const enrichedStores = useMemo(
    () => state.stores.map(enrichStoreWithSpecializations),
    [state.stores],
  );
  const filteredStores = useMemo(
    () => applyStoreFilters(enrichedStores, filters),
    [enrichedStores, filters],
  );
  const hasActiveFilters = Boolean(filters.specialization || filters.productSku);

  const right = state.selectedStore ? (
    <StoreDetailPanel
      store={state.selectedStore}
      onClose={() => state.setSelectedStore(null)}
      isLoggedIn={isLoggedIn}
      isVerified={isVerified}
      preferredStoreCode={preferredStoreCode}
      onSetMyStore={save}
    />
  ) : (
    <StorePlaceholderPanel />
  );

  return (
    <SplitScreenLayout
      left={
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16 }}>
          <StoreFilterPanel filters={filters} onChange={setFilters} />
          <div>
            <StoreLocatorLeftPanel title="list view" state={state}>
              {hasActiveFilters && filteredStores.length === 0 ? (
                <StoreLocatorNoMatch onClearFilters={() => setFilters({})} />
              ) : (
                <StoreListEntries
                  stores={filteredStores}
                  selectedStore={state.selectedStore}
                  preferredStoreCode={preferredStoreCode}
                  onSelect={state.setSelectedStore}
                />
              )}
            </StoreLocatorLeftPanel>
          </div>
        </div>
      }
      right={right}
    />
  );
}
