import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deletePetProfile, fetchPetProfiles, type PetProfileDto } from './pet-profile.api';

export function MyPetsView() {
  const [profiles, setProfiles] = useState<PetProfileDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const refresh = () => {
    setLoading(true);
    void fetchPetProfiles()
      .then(setProfiles)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleDelete = async (id: string) => {
    await deletePetProfile(id);
    setConfirmDeleteId(null);
    refresh();
  };

  if (loading) return <p>Loading My Pets...</p>;

  if (profiles.length === 0) {
    return (
      <div data-testid="my-pets-empty-state">
        <h2>My Pets</h2>
        <p>add your first pet</p>
        <Link to="/account/pets/new">Add Pet</Link>
      </div>
    );
  }

  return (
    <div data-testid="my-pets-list">
      <h2>My Pets</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {profiles.map((profile) => (
          <li key={profile.id} data-testid={`pet-profile-${profile.id}`} style={{ marginBottom: 12 }}>
            <strong>{profile.name}</strong>
            {' · '}
            {profile.species}
            {profile.breed ? ` · ${profile.breed}` : ''}
            {' '}
            <Link to={`/account/pets/${profile.id}/edit`}>Edit</Link>
            {' '}
            <button type="button" onClick={() => setConfirmDeleteId(profile.id)}>Delete</button>
            {confirmDeleteId === profile.id && (
              <div data-testid="delete-confirmation" role="alert">
                <p>are you sure</p>
                <button type="button" onClick={() => void handleDelete(profile.id)}>Confirm Delete</button>
                <button type="button" onClick={() => setConfirmDeleteId(null)}>Cancel</button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <Link to="/account/pets/new">Add Pet</Link>
    </div>
  );
}
