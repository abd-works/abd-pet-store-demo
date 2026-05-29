import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchPets, type PetCardDto } from './pet.api';

const SPECIES_OPTIONS = ['all', 'dog', 'cat', 'reptile', 'small_mammal', 'bird', 'fish'] as const;

export function PetGallery() {
  const [allPets, setAllPets] = useState<PetCardDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecies, setSelectedSpecies] = useState<string>('all');

  const loadPets = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPets();
      setAllPets(Array.isArray(data) ? data : []);
    } catch {
      setAllPets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPets(); }, [loadPets]);

  const handleSpeciesChange = (species: string) => {
    setSelectedSpecies(species);
  };

  const pets = useMemo(() =>
    selectedSpecies === 'all' ? allPets : allPets.filter((p) => p.species === selectedSpecies),
    [allPets, selectedSpecies],
  );

  const storeGroups = useMemo(() => {
    const groups = new Map<string, PetCardDto[]>();
    for (const pet of pets) {
      const key = pet.storeName;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(pet);
    }
    return groups;
  }, [pets]);

  return (
    <div data-testid="pet-gallery">
      <nav aria-label="species filter">
        <ul role="listbox" aria-label="species filter" style={{ listStyle: 'none', padding: 0, display: 'flex', gap: 8, marginBottom: 16 }}>
          {SPECIES_OPTIONS.map((sp) => (
            <li key={sp}>
              <button
                type="button"
                role="option"
                aria-selected={selectedSpecies === sp}
                onClick={() => handleSpeciesChange(sp)}
                style={{
                  padding: '6px 14px',
                  border: selectedSpecies === sp ? '2px solid #3b82f6' : '1px solid #ccc',
                  borderRadius: 20,
                  background: selectedSpecies === sp ? '#eff6ff' : '#fff',
                  cursor: 'pointer',
                  fontWeight: selectedSpecies === sp ? 600 : 400,
                  textTransform: 'capitalize',
                }}
              >
                {sp.replace('_', ' ')}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {!loading && pets.length === 0 && (
        <p>No pets available for the selected species.</p>
      )}

      {[...storeGroups.entries()].map(([storeName, storePets]) => (
        <section key={storeName} style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, marginBottom: 12, color: '#333' }}>{storeName}</h2>
          <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {storePets.map((pet) => (
              <li key={pet.id} style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
                <Link to={`/pets/${pet.id}`} data-testid="pet-profile-link" style={{ textDecoration: 'none', color: 'inherit' }}>
                  {pet.thumbnailUrl && (
                    <img src={pet.thumbnailUrl} alt={pet.name} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                  )}
                  <div style={{ padding: 12 }}>
                    <p style={{ fontWeight: 600, marginBottom: 4 }}>{pet.name}</p>
                    <p style={{ fontSize: 13, color: '#555', marginBottom: 2 }}>{pet.breed}</p>
                    <p style={{ fontSize: 13, color: '#555', marginBottom: 2 }}>{pet.species}</p>
                    {pet.status === 'adopted' && (
                      <span style={{ display: 'inline-block', marginTop: 4, padding: '2px 8px', background: '#f3e8ff', color: '#7c3aed', borderRadius: 4, fontSize: 12 }}>
                        Adopted
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
