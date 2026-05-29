import React from 'react';
import { SplitScreenLayout, StoreDetailPanel, StorePlaceholderPanel } from './store-locator-shared';
import { StoreListEntries } from './StoreListEntries';
import { StoreLocatorLeftPanel } from './StoreLocatorLeftPanel';
import { useStoreLocator } from './useStoreLocator';

export function StoreList() {
  const state = useStoreLocator();
  const right = state.selectedStore ? (
    <StoreDetailPanel store={state.selectedStore} onClose={() => state.setSelectedStore(null)} />
  ) : (
    <StorePlaceholderPanel />
  );

  return (
    <SplitScreenLayout
      left={
        <StoreLocatorLeftPanel title="list view" state={state}>
          <StoreListEntries stores={state.stores} selectedStore={state.selectedStore} onSelect={state.setSelectedStore} />
        </StoreLocatorLeftPanel>
      }
      right={right}
    />
  );
}
