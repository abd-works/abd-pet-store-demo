import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPetProfile, type PetProfileDto } from './pet.api';

interface PetProfilePageProps {
  petId: string;
}

export function PetProfilePage({ petId }: PetProfilePageProps) {
  const [profile, setProfile] = useState<PetProfileDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchPetProfile(petId);
        setProfile(data);
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [petId]);

  if (loading) return <div data-testid="pet-profile">Loading...</div>;
  if (!profile) return <div data-testid="pet-profile">Pet not found</div>;

  const isAdopted = profile.status === 'adopted';

  return (
    <div data-testid="pet-profile" style={{ maxWidth: 640, margin: '0 auto' }}>
      {profile.photoUrls.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {profile.photoUrls.map((url) => (
            <img
              key={url}
              data-testid="pet-photo"
              src={url}
              alt={`${profile.name} photo`}
              style={{ width: 200, height: 160, objectFit: 'cover', borderRadius: 8 }}
            />
          ))}
        </div>
      )}

      <h1 style={{ marginBottom: 4 }}>{profile.name}</h1>
      <p style={{ marginBottom: 4 }}>{profile.breed}</p>
      <p style={{ marginBottom: 4 }}>{profile.species}</p>
      <p style={{ marginBottom: 8 }}>{profile.age} years old</p>

      {profile.temperamentNotes && (
        <p style={{ marginBottom: 12, color: '#444' }}>{profile.temperamentNotes}</p>
      )}

      <p style={{ marginBottom: 12 }}>{profile.storeName}</p>

      {isAdopted ? (
        <div style={{ padding: 12, background: '#f3e8ff', borderRadius: 8, textAlign: 'center' }}>
          <span style={{ color: '#7c3aed', fontWeight: 600 }}>Adopted</span>
          <p style={{ color: '#555', marginTop: 4, fontSize: 14 }}>This pet has found a home!</p>
        </div>
      ) : (
        <Link to={`/pets/${profile.id}/book`}>
          <button type="button" style={{
            padding: '10px 24px',
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 16,
          }}>
            Book a Visit
          </button>
        </Link>
      )}
    </div>
  );
}
