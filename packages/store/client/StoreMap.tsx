import React from 'react';
import { SplitScreenLayout, StoreDetailPanel, StorePlaceholderPanel } from './store-locator-shared';
import { StoreLocatorLeftPanel } from './StoreLocatorLeftPanel';
import { StoreMapTable } from './StoreMapTable';
import { useStoreLocator } from './useStoreLocator';

export function StoreMap() {
  const state = useStoreLocator();
  const right = state.selectedStore ? (
    <StoreDetailPanel store={state.selectedStore} onClose={() => state.setSelectedStore(null)} />
  ) : (
    <StorePlaceholderPanel />
  );

  return (
    <SplitScreenLayout
      left={
        <StoreLocatorLeftPanel title="map view" state={state}>
          <StoreMapTable stores={state.stores} selectedStore={state.selectedStore} onSelect={state.setSelectedStore} />
        </StoreLocatorLeftPanel>
      }
      right={right}
    />
  );
}
