import React from 'react';

interface FacetValue {
  value: string;
  count: number;
}

interface FilterFacetsPanelProps {
  facets: Record<string, FacetValue[]>;
  active: {
    category?: string;
    petType?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
  };
  onChange: (next: FilterFacetsPanelProps['active']) => void;
}

export function FilterFacetsPanel({ facets, active, onChange }: FilterFacetsPanelProps) {
  const categoryFacets = facets.category ?? [];

  return (
    <aside aria-label="filter facets panel" data-testid="filter-facets-panel">
      <h2 style={{ fontSize: 16 }}>Filter Facet</h2>
      <fieldset>
        <legend>category</legend>
        {categoryFacets.map(({ value, count }) => (
          <label key={value} style={{ display: 'block', marginBottom: 4 }}>
            <input
              type="radio"
              name="category"
              checked={active.category === value}
              onChange={() => onChange({ ...active, category: value })}
            />
            {' '}
            {value}
            {' '}
            <span aria-label="facet match count">({count})</span>
          </label>
        ))}
      </fieldset>
      <fieldset style={{ marginTop: 12 }}>
        <legend>brand</legend>
        {(facets.brand ?? []).map(({ value, count }) => (
          <label key={value} style={{ display: 'block', marginBottom: 4 }}>
            <input
              type="radio"
              name="brand"
              checked={active.brand === value}
              onChange={() => onChange({ ...active, brand: value })}
            />
            {' '}
            {value}
            {' '}
            <span aria-label="facet match count">({count})</span>
          </label>
        ))}
      </fieldset>
      <fieldset style={{ marginTop: 12 }}>
        <legend>pet type</legend>
        {['dog', 'cat', 'reptile'].map((petType) => (
          <label key={petType} style={{ display: 'block', marginBottom: 4 }}>
            <input
              type="radio"
              name="petType"
              checked={active.petType === petType}
              onChange={() => onChange({ ...active, petType })}
            />
            {' '}
            {petType}
          </label>
        ))}
      </fieldset>
      <fieldset style={{ marginTop: 12 }}>
        <legend>price range</legend>
        <label htmlFor="min-price">min</label>
        <input
          id="min-price"
          type="number"
          value={active.minPrice ?? ''}
          onChange={(e) => onChange({ ...active, minPrice: e.target.value ? Number(e.target.value) : undefined })}
          style={{ display: 'block', marginBottom: 4, width: '100%' }}
        />
        <label htmlFor="max-price">max</label>
        <input
          id="max-price"
          type="number"
          value={active.maxPrice ?? ''}
          onChange={(e) => onChange({ ...active, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
          style={{ display: 'block', width: '100%' }}
        />
      </fieldset>
      <label style={{ display: 'block', marginTop: 12 }}>
        <input
          type="checkbox"
          checked={Boolean(active.inStock)}
          onChange={(e) => onChange({ ...active, inStock: e.target.checked || undefined })}
        />
        {' '}
        stock availability
      </label>
    </aside>
  );
}
