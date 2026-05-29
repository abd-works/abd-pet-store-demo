import React from 'react';
import type { StoreResponse } from './store.api';
import { LocationEntryForm } from './LocationEntryForm';
import { storeListHeadingStyle, storeLoadingStyle } from './storeLocatorStyles';
import type { StoreLocatorState } from './useStoreLocator';

interface StoreLocatorLoadingOrContentProps {
  loading: boolean;
  children: React.ReactNode;
}

function StoreLocatorLoadingOrContent({ loading, children }: StoreLocatorLoadingOrContentProps) {
  if (loading) return <p style={storeLoadingStyle}>Loading stores...</p>;
  return <>{children}</>;
}

interface StoreLocatorLeftPanelProps {
  title: string;
  state: StoreLocatorState;
  stores: StoreResponse[];
  children: React.ReactNode;
}

export function StoreLocatorLeftPanel({ title, state, children }: StoreLocatorLeftPanelProps) {
  return (
    <>
      <h2 style={storeListHeadingStyle}>{title}</h2>
      <LocationEntryForm state={state} />
      <StoreLocatorLoadingOrContent loading={state.loading}>{children}</StoreLocatorLoadingOrContent>
    </>
  );
}
