import React from 'react';
import {
  PRODUCT_AVAILABILITY_OPTIONS,
  STORE_SPECIALIZATION_OPTIONS,
  type StoreFilterState,
} from './storeFilterUtils';

interface StoreFilterPanelProps {
  filters: StoreFilterState;
  onChange: (next: StoreFilterState) => void;
}

export function StoreFilterPanel({ filters, onChange }: StoreFilterPanelProps) {
  return (
    <aside aria-label="store filter panel" data-testid="store-filter-panel">
      <h2 style={{ fontSize: 16, marginTop: 0 }}>store specialization filter</h2>
      <fieldset>
        <legend>store specialization filter</legend>
        {STORE_SPECIALIZATION_OPTIONS.map((value) => (
          <label key={value} style={{ display: 'block', marginBottom: 4 }}>
            <input
              type="radio"
              name="storeSpecialization"
              checked={filters.specialization === value}
              onChange={() => onChange({ ...filters, specialization: value })}
            />
            {' '}
            {value}
          </label>
        ))}
        <label style={{ display: 'block', marginTop: 4 }}>
          <input
            type="radio"
            name="storeSpecialization"
            checked={!filters.specialization}
            onChange={() => onChange({ ...filters, specialization: undefined })}
          />
          {' '}
          any specialization
        </label>
      </fieldset>

      <h2 style={{ fontSize: 16 }}>product availability filter</h2>
      <fieldset>
        <legend>product availability filter</legend>
        <label htmlFor="product-availability-filter" style={{ display: 'block', marginBottom: 8 }}>
          product
        </label>
        <select
          id="product-availability-filter"
          value={filters.productSku ?? ''}
          onChange={(event) =>
            onChange({
              ...filters,
              productSku: event.target.value || undefined,
            })
          }
          style={{ width: '100%', padding: 6 }}
        >
          <option value="">any product</option>
          {PRODUCT_AVAILABILITY_OPTIONS.map(({ sku, label }) => (
            <option key={sku} value={sku}>
              {label}
            </option>
          ))}
        </select>
      </fieldset>
    </aside>
  );
}
