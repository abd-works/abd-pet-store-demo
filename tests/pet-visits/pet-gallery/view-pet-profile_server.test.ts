/**
 * View Pet Profile — server acceptance tests (Increment 6)
 *
 * Stories: View Pet Profile, View Pet Store Location and Distance
 * Scenarios: full profile for available pet, adopted pet badge, no temperament
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { PetVisitsServerHelper } from '../helpers/pet-visits.server';

describe('View Pet Profile', () => {
  const helper = new PetVisitsServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('pet profile displays full details for available pet', async () => {
    // Given: Pet PET-001 named Buddy with lifecycleState Available
    const agent = helper.createSessionAgent();

    // When: customer opens the pet profile page for Pet PET-001
    const response = await helper.when_view_pet_profile(agent, 'PET-001');

    // Then: profile shows photos, heading, age, temperament, store, action button
    helper.then_pet_profile_shows(response, {
      petName: 'Buddy',
      breed: 'Golden Retriever',
      species: 'dog',
      age: 2,
      photoCount: 2,
      storeName: 'PawPlace Bristol',
    });
    expect(response.body.temperamentNotes).toBe('Friendly with children, high energy, loves fetch');
    expect(response.body.status).toBe('available');
  });

  it('adopted pet profile shows adopted badge and viewable details', async () => {
    // Given: Pet PET-005 named Rex with lifecycleState Adopted
    const agent = helper.createSessionAgent();

    // When: customer opens the pet profile page for Pet PET-005
    const response = await helper.when_view_pet_profile(agent, 'PET-005');

    // Then: profile shows adopted status
    expect(response.body.name).toBe('Rex');
    expect(response.body.status).toBe('adopted');
    expect(response.body.breed).toBe('Golden Retriever');
    expect(response.body.species).toBe('dog');
  });

  it('pet profile without temperament shows remaining sections', async () => {
    // Given: Pet PET-003 named Slinky with no TemperamentAssessment entries
    const agent = helper.createSessionAgent();

    // When: customer opens the pet profile page for Pet PET-003
    const response = await helper.when_view_pet_profile(agent, 'PET-003');

    // Then: profile shows breed, species, store but no temperament
    helper.then_pet_profile_shows(response, {
      petName: 'Slinky',
      breed: 'Ball Python',
      species: 'reptile',
      age: 1,
      photoCount: 1,
      storeName: 'PawPlace London',
    });
    expect(response.body.temperamentNotes).toBeNull();
  });

  it('pet profile shows store details', async () => {
    // Given: Pet PET-001 hosted at Store STR-001
    const agent = helper.createSessionAgent();

    // When: customer views the pet profile page for Pet PET-001
    const response = await helper.when_view_pet_profile(agent, 'PET-001');

    // Then: store section shows store name and address
    expect(response.body.storeName).toBe('PawPlace Bristol');
    expect(response.body.storeAddress).toBe('15 Queen Street, Bristol, BS1 4QT');
  });
});
