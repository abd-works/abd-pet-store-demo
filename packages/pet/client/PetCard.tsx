import React from 'react';
import type { PetDto } from './pet.api';

interface PetCardProps {
  pet: PetDto;
  onClick: () => void;
}

export function PetCard({ pet, onClick }: PetCardProps) {
  const photo = pet.photoUrls[0] ?? null;

  return (
    <li
      role="listitem"
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      tabIndex={0}
      aria-label={`${pet.name}, ${pet.breed}, ${pet.species}, at ${pet.storeName}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #ddd',
        borderRadius: 8,
        overflow: 'hidden',
        cursor: 'pointer',
        background: '#fff',
        transition: 'box-shadow 0.15s',
      }}
    >
      {photo ? (
        <img
          src={photo}
          alt={`${pet.name}`}
          loading="lazy"
          style={{ width: '100%', height: 180, objectFit: 'cover' }}
        />
      ) : (
        <div
          style={{ width: '100%', height: 180, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}
          aria-hidden="true"
        >
          no photo
        </div>
      )}
      <div style={{ padding: '12px 16px' }}>
        <p style={{ fontWeight: 600, marginBottom: 4 }}>{pet.name}</p>
        <p style={{ fontSize: 13, color: '#555', marginBottom: 2 }}>{pet.breed} · {pet.species}</p>
        <p style={{ fontSize: 12, color: '#777' }}>{pet.storeName}</p>
        {pet.status === 'adopted' && (
          <span
            aria-label="Pet status: Adopted"
            style={{ display: 'inline-block', marginTop: 6, padding: '2px 8px', background: '#f3e8ff', color: '#7c3aed', borderRadius: 4, fontSize: 12 }}
          >
            Adopted
          </span>
        )}
      </div>
    </li>
  );
}
