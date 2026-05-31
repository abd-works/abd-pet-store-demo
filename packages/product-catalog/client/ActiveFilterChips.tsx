import React from 'react';

interface ActiveFilterChipsProps {
  active: {
    category?: string;
    petType?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
  };
  onRemove: (key: keyof ActiveFilterChipsProps['active']) => void;
  onClearAll: () => void;
}

export function ActiveFilterChips({ active, onRemove, onClearAll }: ActiveFilterChipsProps) {
  const chips: Array<{ key: keyof ActiveFilterChipsProps['active']; label: string }> = [];
  if (active.category) chips.push({ key: 'category', label: active.category });
  if (active.petType) chips.push({ key: 'petType', label: active.petType });
  if (active.brand) chips.push({ key: 'brand', label: active.brand });
  if (active.minPrice !== undefined) chips.push({ key: 'minPrice', label: `min ${active.minPrice}` });
  if (active.maxPrice !== undefined) chips.push({ key: 'maxPrice', label: `max ${active.maxPrice}` });
  if (active.inStock) chips.push({ key: 'inStock', label: 'in stock' });

  if (chips.length === 0) return null;

  return (
    <div role="toolbar" aria-label="active filters" data-testid="active-filter-chips" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
      {chips.map(({ key, label }) => (
        <button key={key} type="button" onClick={() => onRemove(key)} aria-label={`Remove filter ${label}`}>
          {label}
          {' ×'}
        </button>
      ))}
      <button type="button" onClick={onClearAll}>clear all filters</button>
    </div>
  );
}
