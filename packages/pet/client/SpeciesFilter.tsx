import React from 'react';

const SPECIES = ['All', 'Dogs', 'Cats', 'Reptiles', 'Small Mammals'] as const;

interface SpeciesFilterProps {
  selected: string;
  onChange: (species: string) => void;
}

export function SpeciesFilter({ selected, onChange }: SpeciesFilterProps) {
  return (
    <nav aria-label="species filter">
      <ul
        role="listbox"
        aria-label="species filter"
        style={{ listStyle: 'none', padding: 0, margin: 0 }}
      >
        {SPECIES.map((species) => {
          const active = selected === species;
          return (
            <li key={species} style={{ marginBottom: 4 }}>
              <button
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => onChange(species)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 12px',
                  background: active ? '#f0f9ff' : 'transparent',
                  border: active ? '1px solid #3b82f6' : '1px solid transparent',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: active ? 600 : 400,
                  color: active ? '#1d4ed8' : '#333',
                  fontSize: 14,
                }}
              >
                {species}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
