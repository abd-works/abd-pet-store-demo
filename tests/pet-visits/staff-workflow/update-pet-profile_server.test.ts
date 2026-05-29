/**
 * Update Pet Profile — server acceptance tests (Increment 6)
 *
 * Stories: Update Pet Profile
 * Scenarios: employee updates fields, new photos added, pet transferred
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { PetVisitsServerHelper } from '../helpers/pet-visits.server';

describe('Update Pet Profile', () => {
  const helper = new PetVisitsServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('store employee updates pet profile fields', async () => {
    // Given: Store Employee at Store STR-001
    //   And: Pet PET-001 hosted at Store STR-001
    const agent = helper.createSessionAgent();

    // When: Store Employee saves changes to temperament
    const response = await helper.when_update_pet_profile(agent, 'PET-001', {
      temperamentNotes: 'Very gentle, great family dog',
    });

    // Then: customer-facing pet profile shows updated temperament
    expect(response.body.temperamentNotes).toBe('Very gentle, great family dog');
  });

  it('new photos added to pet photo gallery', async () => {
    // Given: Pet PET-001 with 2 existing PetPhoto entries
    const agent = helper.createSessionAgent();

    // When: Store Employee uploads new photos
    const response = await helper.when_update_pet_profile(agent, 'PET-001', {
      photoUrls: ['pet001_front.jpg', 'pet001_playing.jpg', 'pet001_outdoor.jpg'],
    });

    // Then: gallery total is 3 photos
    expect(response.body.photoUrls).toHaveLength(3);
    expect(response.body.photoUrls).toContain('pet001_outdoor.jpg');
  });
});
