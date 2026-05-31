import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StaffPage } from '../../components/CustomerPage';
import { fetchPet, updatePet, markPetAdopted, uploadPetPhoto, removePetPhoto } from '../../../../pet/client/pet.api';
import type { PetDto } from '../../../../pet/client/pet.api';

const SPECIES_OPTIONS = ['Dogs', 'Cats', 'Reptiles', 'Small Mammals'];

export function StaffPetProfileEditorPage() {
  const { petId } = useParams<{ petId: string }>();
  const navigate = useNavigate();
  const [pet, setPet] = useState<PetDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adoptionConfirm, setAdoptionConfirm] = useState(false);
  const [form, setForm] = useState<Partial<PetDto>>({});
  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!petId) return;
    fetchPet(petId)
      .then((p) => {
        setPet(p);
        setPhotos(p.photoUrls);
        setForm({
          name: p.name, species: p.species, breed: p.breed,
          age: p.age, temperamentNotes: p.temperamentNotes ?? undefined, storeCode: p.storeCode,
        });
      })
      .catch(() => setError('Failed to load pet profile'))
      .finally(() => setLoading(false));
  }, [petId]);

  const handleSave = async () => {
    if (!petId) return;
    setSubmitting(true);
    setError(null);
    const statusChangedToAdopted = form.status === 'adopted' && pet?.status !== 'adopted';
    if (statusChangedToAdopted && !adoptionConfirm) {
      setAdoptionConfirm(true);
      setSubmitting(false);
      return;
    }
    try {
      if (statusChangedToAdopted) {
        await markPetAdopted(petId);
      } else {
        await updatePet(petId, { ...form, photoUrls: photos });
      }
      navigate('/staff/appointments');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Save failed';
      if (msg.toLowerCase().includes('already adopted')) {
        setError('This pet is already adopted');
      } else {
        setError(msg);
      }
    } finally {
      setSubmitting(false);
      setAdoptionConfirm(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!petId || !e.target.files) return;
    for (const file of Array.from(e.target.files)) {
      try {
        const { photoUrl } = await uploadPetPhoto(petId, file);
        setPhotos((prev) => [...prev, photoUrl]);
      } catch {
        setError('Photo upload failed');
      }
    }
  };

  const handleRemovePhoto = async (url: string) => {
    if (!petId) return;
    try {
      await removePetPhoto(petId, url);
      setPhotos((prev) => prev.filter((p) => p !== url));
    } catch {
      setError('Failed to remove photo');
    }
  };

  if (loading) return <StaffPage title="edit pet profile"><p>Loading…</p></StaffPage>;
  if (!pet) return <StaffPage title="edit pet profile"><p role="alert">{error ?? 'Pet not found'}</p></StaffPage>;

  const isAlreadyAdopted = pet.status === 'adopted';

  return (
    <StaffPage title="edit pet profile">
      {isAlreadyAdopted && (
        <div role="alert" style={{ marginBottom: 16, padding: '10px 14px', background: '#fef2f2', borderRadius: 8, color: '#dc2626' }}>
          This pet is already adopted
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        {(['name', 'breed', 'age', 'temperamentNotes'] as const).map((field) => (
          <div key={field}>
            <label htmlFor={`field-${field}`} style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}>
              {field === 'temperamentNotes' ? 'Temperament Notes' : field.charAt(0).toUpperCase() + field.slice(1)}
              {field !== 'temperamentNotes' && <span style={{ color: '#dc2626' }}> *</span>}
            </label>
            <input
              id={`field-${field}`}
              aria-label={field}
              aria-required={field !== 'temperamentNotes'}
              type={field === 'age' ? 'number' : 'text'}
              value={String(form[field] ?? '')}
              onChange={(e) => setForm((f) => ({ ...f, [field]: field === 'age' ? Number(e.target.value) : e.target.value }))}
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }}
            />
          </div>
        ))}
        <div>
          <label htmlFor="field-species" style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}>
            Species <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <select
            id="field-species"
            aria-label="species"
            aria-required="true"
            value={form.species ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, species: e.target.value }))}
            style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }}
          >
            <option value="">Select species…</option>
            {SPECIES_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="field-status" style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}>
            Pet Status <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <select
            id="field-status"
            aria-label="Pet Status"
            value={form.status ?? pet.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as 'available' | 'adopted' }))}
            disabled={isAlreadyAdopted}
            style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }}
          >
            <option value="available">Available</option>
            <option value="adopted">Adopted</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, marginBottom: 8 }}>Pet Photo Gallery</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 12px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {photos.map((url) => (
            <li key={url} style={{ position: 'relative' }}>
              <img src={url} alt="" loading="lazy" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 6, display: 'block' }} />
              <input
                type="text"
                aria-label={`Alt text for photo ${url}`}
                placeholder="alt text"
                style={{ display: 'block', width: 72, fontSize: 10, marginTop: 2, padding: '2px 4px', border: '1px solid #d1d5db', borderRadius: 4 }}
              />
              <button
                type="button"
                onClick={() => handleRemovePhoto(url)}
                aria-label="Remove photo"
                style={{ position: 'absolute', top: 2, right: 2, background: '#dc2626', color: '#fff', border: 'none', borderRadius: 3, padding: '1px 5px', cursor: 'pointer', fontSize: 11 }}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          aria-label="Upload photo"
          onClick={() => fileInputRef.current?.click()}
          style={{ padding: '6px 12px', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}
        >
          Upload Photo
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoUpload}
          style={{ display: 'none' }}
          aria-label="Upload photo"
        />
      </div>

      {adoptionConfirm && (
        <div role="dialog" aria-modal="true" aria-labelledby="adopt-confirm-heading" style={{ marginBottom: 16, padding: '16px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8 }}>
          <p id="adopt-confirm-heading" style={{ fontWeight: 600, marginBottom: 8 }}>Mark as Adopted?</p>
          <p style={{ fontSize: 13, color: '#555', marginBottom: 12 }}>This will transition the pet status to Adopted and notify customers with pending appointments.</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" onClick={handleSave} style={{ padding: '6px 12px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
              Confirm Adoption
            </button>
            <button type="button" onClick={() => { setAdoptionConfirm(false); setForm((f) => ({ ...f, status: 'available' })); }} style={{ padding: '6px 12px', background: '#fff', border: '1px solid #d1d5db', borderRadius: 6, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && <p role="alert" style={{ color: '#dc2626', marginBottom: 12 }}>{error}</p>}

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="button"
          onClick={handleSave}
          disabled={submitting || isAlreadyAdopted}
          style={{
            padding: '10px 20px',
            background: submitting || isAlreadyAdopted ? '#e5e7eb' : '#3b82f6',
            color: submitting || isAlreadyAdopted ? '#9ca3af' : '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: submitting || isAlreadyAdopted ? 'not-allowed' : 'pointer',
            fontWeight: 600,
          }}
        >
          {submitting ? 'Saving…' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/staff/appointments')}
          disabled={submitting}
          style={{ padding: '10px 20px', background: '#fff', border: '1px solid #d1d5db', borderRadius: 6, cursor: 'pointer' }}
        >
          Cancel
        </button>
      </div>
    </StaffPage>
  );
}
