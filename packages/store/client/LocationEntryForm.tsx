import React from 'react';
import { distanceOutputStyle, formRowStyle, postcodeInputStyle, postcodeLabelStyle } from './storeLocatorStyles';
import type { StoreLocatorState } from './useStoreLocator';
import { geocodePostcode } from './mock-stores';

function PostcodeField({ postcode, onChange }: { postcode: string; onChange: (value: string) => void }) {
  return (
    <label htmlFor="postcode-input" style={postcodeLabelStyle}>
      postcode
      <input
        id="postcode-input"
        type="text"
        aria-label="postcode"
        placeholder="e.g. M3 2FF"
        value={postcode}
        onChange={(event) => onChange(event.target.value)}
        style={postcodeInputStyle}
      />
    </label>
  );
}

function DistanceOutput({ nearestDistance }: { nearestDistance?: number }) {
  return (
    <output aria-label="distance" style={distanceOutputStyle}>
      distance{' '}
      {nearestDistance !== undefined ? `${nearestDistance.toFixed(1)} km (nearest)` : '—'}
    </output>
  );
}

function nearestStoreDistance(state: StoreLocatorState): number | undefined {
  if (!state.hasLocation) return undefined;
  return state.stores.find((store) => store.distance_km !== undefined)?.distance_km;
}

interface LocationEntryFormProps {
  state: StoreLocatorState;
}

export function LocationEntryForm({ state }: LocationEntryFormProps) {
  return (
    <form
      aria-label="location entry"
      onSubmit={(event) => {
        event.preventDefault();
        state.handleFindByPostcode(state.postcode, geocodePostcode);
      }}
      style={formRowStyle}
    >
      <PostcodeField postcode={state.postcode} onChange={state.setPostcode} />
      <DistanceOutput nearestDistance={nearestStoreDistance(state)} />
      <button type="button" onClick={state.handleShareLocation}>share location</button>
      <button type="submit">find stores</button>
      <button type="button" onClick={state.handleClearLocation}>clear location</button>
    </form>
  );
}
