/**
 * View Pet Profile — client acceptance tests (Increment 6)
 *
 * Stories: View Pet Profile
 * Scenarios: full profile display, adopted badge, booking action button
 */
import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PetProfilePage } from '@pawplace/pet-client';
import type { PetProfileDto } from '@pawplace/pet-client/pet.api';
import * as petApi from '@pawplace/pet-client/pet.api';

vi.mock('@pawplace/pet-client/pet.api');

const AVAILABLE_PET_PROFILE: PetProfileDto = {
  id: 'PET-001',
  name: 'Buddy',
  breed: 'Golden Retriever',
  species: 'dog',
  age: 2,
  temperamentNotes: 'Friendly with children, high energy, loves fetch',
  photoUrls: ['pet001_front.jpg', 'pet001_playing.jpg'],
  storeName: 'PawPlace Bristol',
  thumbnailUrl: 'pet001_front.jpg',
  status: 'available',
  distanceKm: null,
};

const ADOPTED_PET_PROFILE: PetProfileDto = {
  id: 'PET-005',
  name: 'Rex',
  breed: 'Golden Retriever',
  species: 'dog',
  age: 3,
  temperamentNotes: null,
  photoUrls: ['pet005_front.jpg'],
  storeName: 'PawPlace London',
  thumbnailUrl: 'pet005_front.jpg',
  status: 'adopted',
  distanceKm: null,
};

describe('View Pet Profile', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('pet profile displays full details for available pet', async () => {
    // Given: Pet PET-001 named Buddy with lifecycleState Available
    vi.mocked(petApi.fetchPetProfile).mockResolvedValue(AVAILABLE_PET_PROFILE);

    // When: customer opens the Pet Profile Page
    render(
      React.createElement(MemoryRouter, null, React.createElement(PetProfilePage, { petId: 'PET-001' })),
    );

    // Then: page shows photos, heading, age, temperament, store, action button
    await screen.findByTestId('pet-profile');
    expect(screen.getByText('Buddy')).toBeInTheDocument();
    expect(screen.getByText('Golden Retriever')).toBeInTheDocument();
    expect(screen.getByText(/2 years old/i)).toBeInTheDocument();
    expect(screen.getByText('Friendly with children, high energy, loves fetch')).toBeInTheDocument();
    expect(screen.getByText('PawPlace Bristol')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /book a visit/i })).toBeInTheDocument();
  });

  it('adopted pet profile shows adopted badge and no booking button', async () => {
    // Given: Pet PET-005 named Rex with lifecycleState Adopted
    vi.mocked(petApi.fetchPetProfile).mockResolvedValue(ADOPTED_PET_PROFILE);

    // When: customer opens the Pet Profile Page
    render(
      React.createElement(MemoryRouter, null, React.createElement(PetProfilePage, { petId: 'PET-005' })),
    );

    // Then: profile shows adopted badge
    await screen.findByTestId('pet-profile');
    expect(screen.getByText('Rex')).toBeInTheDocument();
    expect(screen.getByText(/adopted/i)).toBeInTheDocument();
    expect(screen.getByText(/this pet has found a home/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /book a visit/i })).not.toBeInTheDocument();
  });

  it('pet profile shows photo gallery with correct count', async () => {
    // Given: Pet PET-001 with 2 photos
    vi.mocked(petApi.fetchPetProfile).mockResolvedValue(AVAILABLE_PET_PROFILE);

    // When: customer opens the Pet Profile Page
    render(
      React.createElement(MemoryRouter, null, React.createElement(PetProfilePage, { petId: 'PET-001' })),
    );

    // Then: photo gallery shows 2 photos
    await screen.findByTestId('pet-profile');
    const photos = screen.getAllByTestId('pet-photo');
    expect(photos).toHaveLength(2);
  });
});
