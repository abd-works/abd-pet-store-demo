import React from 'react';

interface StoreLocatorNoMatchProps {
  onClearFilters: () => void;
}

export function StoreLocatorNoMatch({ onClearFilters }: StoreLocatorNoMatchProps) {
  return (
    <div data-testid="no-stores-match-filters" role="status">
      <p>no stores match your filters</p>
      <button type="button" onClick={onClearFilters}>
        clear filters
      </button>
    </div>
  );
}
