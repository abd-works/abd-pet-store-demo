import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createPetProfile, updatePetProfile, type PetProfileDto } from './pet-profile.api';

export interface PetProfileFormProps {
  initial?: PetProfileDto;
  isLoggedIn: boolean;
  isVerified: boolean;
}

export function PetProfileForm({ initial, isLoggedIn, isVerified }: PetProfileFormProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [name, setName] = useState(initial?.name ?? '');
  const [species, setSpecies] = useState(initial?.species ?? '');
  const [breed, setBreed] = useState(initial?.breed ?? '');
  const [ageOrDob, setAgeOrDob] = useState(initial?.ageOrDob ?? '');
  const [photoUrl, setPhotoUrl] = useState(initial?.photoUrl ?? '');
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isLoggedIn || !isVerified) {
      setGuestModalOpen(true);
      return;
    }
    setSaving(true);
    try {
      const payload = { name, species, breed: breed || undefined, ageOrDob: ageOrDob || undefined, photoUrl: photoUrl || undefined };
      if (initial) {
        await updatePetProfile(initial.id, payload);
      } else {
        await createPetProfile(payload);
      }
      navigate('/account/pets');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form data-testid="pet-profile-form" onSubmit={(event) => void handleSubmit(event)}>
      <h2>{initial ? 'Edit pet profile' : 'Add pet profile'}</h2>
      <label htmlFor="pet-name">name</label>
      <input id="pet-name" required value={name} onChange={(e) => setName(e.target.value)} style={{ display: 'block', marginBottom: 8, width: '100%' }} />
      <label htmlFor="pet-species">species</label>
      <input id="pet-species" required value={species} onChange={(e) => setSpecies(e.target.value)} style={{ display: 'block', marginBottom: 8, width: '100%' }} />
      <label htmlFor="pet-breed">breed (optional)</label>
      <input id="pet-breed" value={breed} onChange={(e) => setBreed(e.target.value)} style={{ display: 'block', marginBottom: 8, width: '100%' }} />
      <label htmlFor="pet-age">age or date of birth (optional)</label>
      <input id="pet-age" value={ageOrDob} onChange={(e) => setAgeOrDob(e.target.value)} style={{ display: 'block', marginBottom: 8, width: '100%' }} />
      <label htmlFor="pet-photo">photo upload (optional)</label>
      <input id="pet-photo" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="photo URL" style={{ display: 'block', marginBottom: 8, width: '100%' }} />
      <button type="submit" disabled={saving}>Save</button>
      <Link to="/account/pets" style={{ marginLeft: 8 }}>Cancel</Link>
      {!isLoggedIn && (
        <p data-testid="pet-guest-note">
          <Link to={`/login?returnTo=${encodeURIComponent(pathname)}`}>Log In</Link>
          {' · '}
          <Link to={`/register?returnTo=${encodeURIComponent(pathname)}`}>Register</Link>
        </p>
      )}
      {!isLoggedIn && guestModalOpen && (
        <div role="dialog" aria-modal="true" data-testid="pet-guest-modal">
          <p>log in or register</p>
          <Link to={`/login?returnTo=${encodeURIComponent(pathname)}`}>Log In</Link>
          {' · '}
          <Link to={`/register?returnTo=${encodeURIComponent(pathname)}`}>Register</Link>
          <button type="button" onClick={() => setGuestModalOpen(false)}>close</button>
        </div>
      )}
    </form>
  );
}
