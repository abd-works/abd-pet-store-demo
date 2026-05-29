import React, { useState } from 'react';

interface PetPhotoGalleryProps {
  photoUrls: string[];
  petName: string;
}

export function PetPhotoGallery({ photoUrls, petName }: PetPhotoGalleryProps) {
  const [selected, setSelected] = useState(0);

  if (photoUrls.length === 0) {
    return (
      <div
        style={{ width: '100%', height: 320, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, color: '#888' }}
        aria-label={`No photos available for ${petName}`}
      >
        no photos available
      </div>
    );
  }

  return (
    <div>
      <img
        src={photoUrls[selected]}
        alt={`${petName} — main photo`}
        style={{ width: '100%', height: 320, objectFit: 'cover', borderRadius: 8 }}
        loading="eager"
      />
      {photoUrls.length > 1 && (
        <ul
          role="listbox"
          aria-label="Pet photos"
          style={{ display: 'flex', gap: 8, listStyle: 'none', padding: 0, marginTop: 8 }}
        >
          {photoUrls.map((url, i) => (
            <li key={url}>
              <button
                type="button"
                role="option"
                aria-selected={i === selected}
                onClick={() => setSelected(i)}
                style={{
                  padding: 0,
                  border: i === selected ? '2px solid #3b82f6' : '2px solid transparent',
                  borderRadius: 4,
                  cursor: 'pointer',
                  background: 'none',
                }}
                aria-label={`Photo ${i + 1} of ${petName}`}
              >
                <img
                  src={url}
                  alt=""
                  loading="lazy"
                  style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 4, display: 'block' }}
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
