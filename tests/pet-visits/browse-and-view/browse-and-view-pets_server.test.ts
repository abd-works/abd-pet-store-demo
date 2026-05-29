/**
 * Browse and View Pets — server tests (Increment 6)
 *
 * Stories: Browse Pets by Species, View Pet Profile, View Pet Store Location and Distance
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  createTestContext,
  PETS,
  STORES,
  CUSTOMERS,
  type PetVisitsTestContext,
} from '../helpers/pet-visits.helper';
import { SpeciesValues } from '../../../packages/pet/shared/Species';
import { PetStatusValues } from '../../../packages/pet/shared/PetStatus';
import { toPetId } from '../../../packages/pet/shared/PetId';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function given_gallery_with_standard_pets(ctx: PetVisitsTestContext): void {
  ctx.petRepo.seed(Object.values(PETS));
}

async function when_customer_opens_pet_gallery(ctx: PetVisitsTestContext) {
  return ctx.petService.listBySpecies();
}

async function when_customer_filters_by_species(ctx: PetVisitsTestContext, species: typeof SpeciesValues[keyof typeof SpeciesValues]) {
  return ctx.petService.listBySpecies(species);
}

async function when_customer_opens_pet_profile(ctx: PetVisitsTestContext, petId: string, customerLocation?: { latitude: number; longitude: number }) {
  return ctx.petService.getProfile(toPetId(petId), customerLocation);
}

// =============================================================================
// STORY: Browse Pets by Species
// =============================================================================

describe('Browse Pets by Species', () => {
  let ctx: PetVisitsTestContext;

  beforeEach(() => {
    ctx = createTestContext();
    given_gallery_with_standard_pets(ctx);
  });

  describe('TestBrowsePetsBySpecies', () => {
    it('pet gallery shows pets filterable by species — PET-001 Dog', async () => {
      // Given: Pet Gallery contains Pet entries across multiple Breed species
      // When: the customer opens the Pet Gallery
      const cards = await when_customer_opens_pet_gallery(ctx);

      // Then: pets are grouped or filterable by species
      const pet001Card = cards.find((c) => c.id === 'PET-001');
      expect(pet001Card).toEqual({
        id: 'PET-001',
        name: 'Buddy',
        breed: 'Golden Retriever',
        species: SpeciesValues.Dog,
        storeName: STORES.STR_001.name,
        thumbnailUrl: 'pet001_front.jpg',
        status: PetStatusValues.Available,
      });
    });

    it('pet gallery shows pets filterable by species — PET-002 Cat', async () => {
      // When
      const cards = await when_customer_opens_pet_gallery(ctx);

      // Then
      const pet002Card = cards.find((c) => c.id === 'PET-002');
      expect(pet002Card).toEqual({
        id: 'PET-002',
        name: 'Whiskers',
        breed: 'Maine Coon',
        species: SpeciesValues.Cat,
        storeName: STORES.STR_001.name,
        thumbnailUrl: 'pet002_front.jpg',
        status: PetStatusValues.Available,
      });
    });

    it('pet gallery shows pets filterable by species — PET-003 Reptile', async () => {
      // When
      const cards = await when_customer_opens_pet_gallery(ctx);

      // Then
      const pet003Card = cards.find((c) => c.id === 'PET-003');
      expect(pet003Card).toEqual({
        id: 'PET-003',
        name: 'Slinky',
        breed: 'Ball Python',
        species: SpeciesValues.Reptile,
        storeName: STORES.STR_002.name,
        thumbnailUrl: 'pet003_front.jpg',
        status: PetStatusValues.Available,
      });
    });
  });

  describe('TestSpeciesFilterApplied', () => {
    it('species filter applied — only Dog pets shown', async () => {
      // When: the customer selects the species filter Dog
      const cards = await when_customer_filters_by_species(ctx, SpeciesValues.Dog);

      // Then: only Pet entries with species Dog are shown
      expect(cards.every((c) => c.species === SpeciesValues.Dog)).toBe(true);
      expect(cards.some((c) => c.id === 'PET-001')).toBe(true);
    });

    it('species filter applied — only Cat pets shown', async () => {
      // When
      const cards = await when_customer_filters_by_species(ctx, SpeciesValues.Cat);

      // Then
      expect(cards.every((c) => c.species === SpeciesValues.Cat)).toBe(true);
      expect(cards.some((c) => c.id === 'PET-002')).toBe(true);
    });

    it('species filter applied — only Reptile pets shown', async () => {
      // When
      const cards = await when_customer_filters_by_species(ctx, SpeciesValues.Reptile);

      // Then
      expect(cards.every((c) => c.species === SpeciesValues.Reptile)).toBe(true);
      expect(cards.some((c) => c.id === 'PET-003')).toBe(true);
    });
  });

  describe('TestNoAvailablePetsForSpecies', () => {
    it('no available pets for selected species — empty state', async () => {
      // Given: the Pet Gallery has no Pet entries with species Bird
      // When: the customer selects the species filter Bird
      const cards = await when_customer_filters_by_species(ctx, SpeciesValues.Bird);

      // Then: gallery shows empty result
      expect(cards).toHaveLength(0);
    });
  });
});

// =============================================================================
// STORY: View Pet Profile
// =============================================================================

describe('View Pet Profile', () => {
  let ctx: PetVisitsTestContext;

  beforeEach(() => {
    ctx = createTestContext();
    given_gallery_with_standard_pets(ctx);
  });

  describe('TestViewPetProfile', () => {
    it('pet profile displays full details for available pet — PET-001', async () => {
      // Given: a Pet PET-001 named Buddy with lifecycleState Available
      // When: the customer opens the Pet Profile Page for Pet PET-001
      const profile = await when_customer_opens_pet_profile(ctx, 'PET-001');

      // Then: the page shows 2 photos, heading, age, temperament, store, action
      expect(profile).toEqual({
        id: 'PET-001',
        name: 'Buddy',
        breed: 'Golden Retriever',
        species: SpeciesValues.Dog,
        storeName: STORES.STR_001.name,
        thumbnailUrl: 'pet001_front.jpg',
        status: PetStatusValues.Available,
        age: 2,
        temperamentNotes: 'Friendly with children, high energy, loves fetch',
        photoUrls: ['pet001_front.jpg', 'pet001_playing.jpg'],
        distanceKm: null,
      });
    });

    it('adopted pet profile shows adopted status — PET-005', async () => {
      // Given: a Pet PET-005 named Rex with lifecycleState Adopted
      // When: the customer opens the Pet Profile Page for Pet PET-005
      const profile = await when_customer_opens_pet_profile(ctx, 'PET-005');

      // Then: the profile shows adopted status
      expect(profile.status).toBe(PetStatusValues.Adopted);
      expect(profile.name).toBe('Rex');
      expect(profile.breed).toBe('Golden Retriever');
      expect(profile.species).toBe(SpeciesValues.Dog);
    });

    it('pet profile without temperament shows remaining sections — PET-003', async () => {
      // Given: a Pet PET-003 named Slinky with no TemperamentAssessment entries
      // When: the customer opens the Pet Profile Page
      const profile = await when_customer_opens_pet_profile(ctx, 'PET-003');

      // Then: temperament is null, other sections present
      expect(profile.temperamentNotes).toBeNull();
      expect(profile.name).toBe('Slinky');
      expect(profile.breed).toBe('Ball Python');
      expect(profile.species).toBe(SpeciesValues.Reptile);
      expect(profile.storeName).toBe(STORES.STR_002.name);
      expect(profile.photoUrls).toEqual(['pet003_front.jpg']);
    });
  });
});

// =============================================================================
// STORY: View Pet Store Location and Distance
// =============================================================================

describe('View Pet Store Location and Distance', () => {
  let ctx: PetVisitsTestContext;

  beforeEach(() => {
    ctx = createTestContext();
    given_gallery_with_standard_pets(ctx);
  });

  describe('TestViewPetStoreLocationAndDistance', () => {
    it('pet profile shows store details — PET-001 at PawPlace Bristol', async () => {
      // When: the customer views the Pet Profile Page for Pet PET-001
      const profile = await when_customer_opens_pet_profile(ctx, 'PET-001');

      // Then: the store section shows PawPlace Bristol
      expect(profile.storeName).toBe('PawPlace Bristol');
    });

    it('distance calculated when customer shares location', async () => {
      // Given: Pet PET-001 hosted at Store STR-001 with known coordinates
      ctx.storeLocator.setDistance(STORES.STR_001.code, 0.7);

      // When: the customer views the Pet Profile Page with their location
      const profile = await when_customer_opens_pet_profile(ctx, 'PET-001', { latitude: 51.4500, longitude: -2.5800 });

      // Then: the distance label reads 0.7 km
      expect(profile.distanceKm).toBe(0.7);
    });

    it('location not shared — distance is null', async () => {
      // Given: customer has not shared their location
      // When: the customer views the Pet Profile Page without location
      const profile = await when_customer_opens_pet_profile(ctx, 'PET-001');

      // Then: distance is null
      expect(profile.distanceKm).toBeNull();
    });
  });
});
