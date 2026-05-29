import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerPage } from '../components/CustomerPage';
import { SpeciesFilter } from '../../../../pet/client/SpeciesFilter';
import { PetCard } from '../../../../pet/client/PetCard';
import { fetchPets } from '../../../../pet/client/pet.api';
import type { PetDto } from '../../../../pet/client/pet.api';

export function PetGalleryPage() {
  const navigate = useNavigate();
  const [species, setSpecies] = useState('All');
  const [pets, setPets] = useState<PetDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchPets(species === 'All' ? undefined : species)
      .then(setPets)
      .catch(() => setError('Failed to load pets'))
      .finally(() => setLoading(false));
  }, [species]);

  return (
    <CustomerPage title="pet gallery">
      <nav aria-label="breadcrumb" style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
        <ol style={{ display: 'flex', gap: 4, listStyle: 'none', padding: 0, margin: 0 }}>
          <li><a href="/" style={{ color: '#3b82f6' }}>Home</a></li>
          <li aria-hidden="true"> › </li>
          <li aria-current="page">Pets</li>
        </ol>
      </nav>
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24 }}>
        <aside>
          <SpeciesFilter selected={species} onChange={setSpecies} />
        </aside>
        <section aria-label="pet gallery grid">
          {loading && <p>Loading pets…</p>}
          {error && <p role="alert" style={{ color: '#dc2626' }}>{error}</p>}
          {!loading && !error && pets.length === 0 && (
            <p aria-live="polite" style={{ color: '#555' }}>
              No pets available in this category right now
            </p>
          )}
          {!loading && !error && pets.length > 0 && (
            <ul
              role="list"
              style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}
            >
              {pets.map((pet) => (
                <PetCard key={pet.petId} pet={pet} onClick={() => navigate(`/pets/${pet.petId}`)} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </CustomerPage>
  );
}
