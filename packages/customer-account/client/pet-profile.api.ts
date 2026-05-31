import { httpJson } from '../../shared/http-client';

export interface PetProfileDto {
  id: string;
  accountId: string;
  name: string;
  species: string;
  breed?: string;
  ageOrDob?: string;
  photoUrl?: string;
}

export async function fetchPetProfiles(): Promise<PetProfileDto[]> {
  const response = await httpJson<{ profiles: PetProfileDto[] }>('/api/account/pets');
  return response.profiles;
}

export async function createPetProfile(input: {
  name: string;
  species: string;
  breed?: string;
  ageOrDob?: string;
  photoUrl?: string;
}): Promise<PetProfileDto> {
  return httpJson<PetProfileDto>('/api/account/pets', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updatePetProfile(
  id: string,
  input: Partial<Pick<PetProfileDto, 'name' | 'species' | 'breed' | 'ageOrDob' | 'photoUrl'>>,
): Promise<PetProfileDto> {
  return httpJson<PetProfileDto>(`/api/account/pets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function deletePetProfile(id: string): Promise<void> {
  await httpJson<{ ok: boolean }>(`/api/account/pets/${id}`, { method: 'DELETE' });
}
