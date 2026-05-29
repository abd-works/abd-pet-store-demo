export interface PetDto {
  petId: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  temperamentNotes: string | null;
  photoUrls: string[];
  status: 'available' | 'adopted';
  storeCode: string;
  storeName: string;
  storeAddress: string;
  storeHours: string;
}

export interface PetCardDto {
  id: string;
  name: string;
  breed: string;
  species: string;
  storeName: string;
  thumbnailUrl: string | null;
  status: 'available' | 'adopted';
}

export interface PetProfileDto extends PetCardDto {
  age: number;
  temperamentNotes: string | null;
  photoUrls: string[];
  distanceKm: number | null;
}

export async function fetchPets(species?: string): Promise<PetDto[]> {
  const url = species ? `/api/pets?species=${encodeURIComponent(species)}` : '/api/pets';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch pets');
  return res.json() as Promise<PetDto[]>;
}

export async function fetchPet(petId: string): Promise<PetDto> {
  const res = await fetch(`/api/pets/${petId}`);
  if (!res.ok) throw new Error('Failed to fetch pet');
  return res.json() as Promise<PetDto>;
}

export async function fetchPetProfile(petId: string): Promise<PetProfileDto> {
  const res = await fetch(`/api/pets/${petId}`);
  if (!res.ok) throw new Error('Failed to fetch pet profile');
  return res.json() as Promise<PetProfileDto>;
}

export async function updatePet(petId: string, updates: Partial<PetDto>): Promise<PetDto> {
  const res = await fetch(`/api/staff/pets/${petId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update pet');
  return res.json() as Promise<PetDto>;
}

export async function markPetAdopted(petId: string): Promise<void> {
  const res = await fetch(`/api/staff/pets/${petId}/adopt`, { method: 'POST' });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error ?? 'Failed to mark pet as adopted');
  }
}

export async function uploadPetPhoto(petId: string, file: File): Promise<{ photoUrl: string }> {
  const form = new FormData();
  form.append('photo', file);
  const res = await fetch(`/api/staff/pets/${petId}/photos`, { method: 'POST', body: form });
  if (!res.ok) throw new Error('Failed to upload photo');
  return res.json() as Promise<{ photoUrl: string }>;
}

export async function removePetPhoto(petId: string, photoUrl: string): Promise<void> {
  const res = await fetch(`/api/staff/pets/${petId}/photos`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ photoUrl }),
  });
  if (!res.ok) throw new Error('Failed to remove photo');
}
