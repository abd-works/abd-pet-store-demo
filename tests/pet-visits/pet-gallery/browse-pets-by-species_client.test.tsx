/**
 * Browse Pets by Species — client acceptance tests (Increment 6)
 *
 * Stories: Browse Pets by Species
 * Scenarios: gallery shows pet cards, species filter, empty state
 */
import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PetGallery } from '@pawplace/pet-client';
import type { PetCardDto } from '@pawplace/pet-client/pet.api';
import * as petApi from '@pawplace/pet-client/pet.api';

vi.mock('@pawplace/pet-client/pet.api');

const GALLERY_PETS: PetCardDto[] = [
  {
    id: 'PET-001',
    name: 'Buddy',
    breed: 'Golden Retriever',
    species: 'dog',
    storeName: 'PawPlace Bristol',
    thumbnailUrl: 'pet001_front.jpg',
    status: 'available',
  },
  {
    id: 'PET-002',
    name: 'Whiskers',
    breed: 'Maine Coon',
    species: 'cat',
    storeName: 'PawPlace Bristol',
    thumbnailUrl: 'pet002_front.jpg',
    status: 'available',
  },
  {
    id: 'PET-003',
    name: 'Slinky',
    breed: 'Ball Python',
    species: 'reptile',
    storeName: 'PawPlace London',
    thumbnailUrl: 'pet003_front.jpg',
    status: 'available',
  },
  {
    id: 'PET-004',
    name: 'Biscuit',
    breed: 'Holland Lop',
    species: 'small_mammal',
    storeName: 'PawPlace London',
    thumbnailUrl: 'pet004_front.jpg',
    status: 'available',
  },
];

describe('Browse Pets by Species', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('pet gallery shows pet cards with breed, species, and store', async () => {
    // Given: Pet Gallery contains pet entries across multiple breed species
    vi.mocked(petApi.fetchPets).mockResolvedValue(GALLERY_PETS);

    // When: customer opens the Pet Gallery
    render(
      React.createElement(MemoryRouter, null, React.createElement(PetGallery, null)),
    );

    // Then: pet cards show breed, species, and store
    await screen.findByTestId('pet-gallery');
    expect(screen.getByText('Buddy')).toBeInTheDocument();
    expect(screen.getByText('Golden Retriever')).toBeInTheDocument();
    expect(screen.getByText('PawPlace Bristol')).toBeInTheDocument();
    expect(screen.getByText('Slinky')).toBeInTheDocument();
    expect(screen.getByText('Ball Python')).toBeInTheDocument();
  });

  it('species filter applied — only matching pets shown', async () => {
    // Given: Pet Gallery contains pets of multiple species
    vi.mocked(petApi.fetchPets).mockImplementation(async (species?: string) =>
      Promise.resolve(species
        ? GALLERY_PETS.filter((p) => p.species === species)
        : GALLERY_PETS));

    render(
      React.createElement(MemoryRouter, null, React.createElement(PetGallery, null)),
    );
    await screen.findByTestId('pet-gallery');

    // When: customer selects the species filter "dog"
    fireEvent.click(screen.getByRole('option', { name: /dog/i }));

    // Then: only Dog pets are shown
    expect(screen.getByText('Buddy')).toBeInTheDocument();
    expect(screen.queryByText('Whiskers')).not.toBeInTheDocument();
    expect(screen.queryByText('Slinky')).not.toBeInTheDocument();
  });

  it('no available pets for selected species — empty state with options', async () => {
    // Given: Pet Gallery has no pet entries with species "bird"
    vi.mocked(petApi.fetchPets).mockResolvedValue([]);

    render(
      React.createElement(MemoryRouter, null, React.createElement(PetGallery, null)),
    );
    await screen.findByTestId('pet-gallery');

    // When: customer selects the species filter "bird"
    fireEvent.click(screen.getByRole('option', { name: /bird/i }));

    // Then: gallery shows empty state message
    expect(await screen.findByText(/no pets available/i)).toBeInTheDocument();
  });

  it('pet card links to pet profile page', async () => {
    // Given: Pet Gallery with pet entries
    vi.mocked(petApi.fetchPets).mockResolvedValue(GALLERY_PETS);

    render(
      React.createElement(MemoryRouter, null, React.createElement(PetGallery, null)),
    );
    await screen.findByTestId('pet-gallery');

    // Then: each pet card has a link to the pet profile
    const profileLinks = screen.getAllByTestId('pet-profile-link');
    expect(profileLinks.length).toBe(GALLERY_PETS.length);
  });
});
