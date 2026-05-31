import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CustomerPage } from '../components/CustomerPage';
import { PetPhotoGallery } from '../../../pet/client/PetPhotoGallery';
import { StoreLocationSection } from '../../../pet/client/StoreLocationSection';
import { GuestAuthGateModal } from '../../../appointment/client/GuestAuthGateModal';
import { useCustomerSession } from '../context/CustomerSessionContext';
import { fetchPet } from '../../../pet/client/pet.api';
import type { PetDto } from '../../../pet/client/pet.api';

export function PetProfilePage() {
  const { petId } = useParams<{ petId: string }>();
  const navigate = useNavigate();
  const { isLoggedIn } = useCustomerSession();
  const [pet, setPet] = useState<PetDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAuthGate, setShowAuthGate] = useState(false);

  useEffect(() => {
    if (!petId) return;
    setLoading(true);
    fetchPet(petId)
      .then(setPet)
      .catch(() => setError('Failed to load pet profile'))
      .finally(() => setLoading(false));
  }, [petId]);

  const handleBookVisit = () => {
    if (!petId) return;
    if (!isLoggedIn) {
      setShowAuthGate(true);
    } else {
      navigate(`/pets/${petId}/book/slots`);
    }
  };

  if (loading) return <CustomerPage title="pet profile"><p>Loading…</p></CustomerPage>;
  if (error || !pet) return <CustomerPage title="pet profile"><p role="alert">{error ?? 'Pet not found'}</p></CustomerPage>;

  const isAdopted = pet.status === 'adopted';

  return (
    <CustomerPage title={pet.name}>
      <nav aria-label="breadcrumb" style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
        <ol style={{ display: 'flex', gap: 4, listStyle: 'none', padding: 0, margin: 0 }}>
          <li><a href="/" style={{ color: '#3b82f6' }}>Home</a></li>
          <li aria-hidden="true"> › </li>
          <li><a href="/pets" style={{ color: '#3b82f6' }}>Pets</a></li>
          <li aria-hidden="true"> › </li>
          <li aria-current="page">{pet.name}</li>
        </ol>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <div>
          <PetPhotoGallery photoUrls={pet.photoUrls} petName={pet.name} />
        </div>
        <div>
          <section aria-label="pet info">
            <h2 style={{ fontSize: 20, marginBottom: 4 }}>{pet.name}</h2>
            <p style={{ color: '#555', marginBottom: 2 }}><strong>species:</strong> {pet.species}</p>
            <p style={{ color: '#555', marginBottom: 2 }}><strong>breed:</strong> {pet.breed}</p>
            <p style={{ color: '#555', marginBottom: 2 }}><strong>age:</strong> {pet.age}</p>
            {pet.temperamentNotes && (
              <p style={{ color: '#555', marginBottom: 2 }}><strong>temperament notes:</strong> {pet.temperamentNotes}</p>
            )}
            <div style={{ marginTop: 12 }}>
              <span
                aria-label={`Pet status: ${isAdopted ? 'Adopted' : 'Available'}`}
                style={{
                  display: 'inline-block',
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  background: isAdopted ? '#f3e8ff' : '#f0fdf4',
                  color: isAdopted ? '#7c3aed' : '#16a34a',
                }}
              >
                {isAdopted ? 'Adopted' : 'Available'}
              </span>
            </div>
          </section>

          <StoreLocationSection
            storeCode={pet.storeCode}
            storeName={pet.storeName}
            storeAddress={pet.storeAddress}
            storeHours={pet.storeHours}
          />

          <div style={{ marginTop: 20 }}>
            <button
              type="button"
              onClick={isAdopted ? undefined : handleBookVisit}
              disabled={isAdopted}
              aria-disabled={isAdopted}
              style={{
                padding: '12px 24px',
                background: isAdopted ? '#e5e7eb' : '#3b82f6',
                color: isAdopted ? '#9ca3af' : '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: isAdopted ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              Book a Visit
            </button>
          </div>
        </div>
      </div>

      {showAuthGate && petId && (
        <GuestAuthGateModal petId={petId} onClose={() => setShowAuthGate(false)} />
      )}
    </CustomerPage>
  );
}
