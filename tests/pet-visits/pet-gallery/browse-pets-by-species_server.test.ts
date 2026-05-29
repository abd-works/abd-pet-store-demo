/**
 * Browse Pets by Species — server acceptance tests (Increment 6)
 *
 * Stories: Browse Pets by Species
 * Scenarios: pet gallery grouped by species, species filter, empty state
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { PetVisitsServerHelper } from '../helpers/pet-visits.server';

describe('Browse Pets by Species', () => {
  const helper = new PetVisitsServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('pet gallery shows pets filterable by species', async () => {
    // Given: pet gallery contains pet entries across multiple breed species
    const agent = helper.createSessionAgent();

    // When: customer opens the pet gallery
    const response = await helper.when_browse_pet_gallery(agent);

    // Then: pets are grouped or filterable by species
    helper.then_pet_gallery_contains(response, 4);
    helper.then_pet_card_shows(response, 'PET-001', { breed: 'Golden Retriever', species: 'dog', storeName: 'PawPlace Bristol' });
    helper.then_pet_card_shows(response, 'PET-002', { breed: 'Maine Coon', species: 'cat', storeName: 'PawPlace Bristol' });
    helper.then_pet_card_shows(response, 'PET-003', { breed: 'Ball Python', species: 'reptile', storeName: 'PawPlace London' });
  });

  it('species filter applied — only matching pets shown for Dog', async () => {
    // Given: pet gallery contains pets of multiple species
    const agent = helper.createSessionAgent();

    // When: customer selects the species filter "dog"
    const response = await helper.when_filter_pets_by_species(agent, 'dog');

    // Then: only pet entries with species "dog" are shown
    helper.then_pets_filtered_by_species(response, 'dog');
    helper.then_pet_gallery_contains(response, 1);
  });

  it('species filter applied — only matching pets shown for Cat', async () => {
    // Given: pet gallery contains pets of multiple species
    const agent = helper.createSessionAgent();

    // When: customer selects the species filter "cat"
    const response = await helper.when_filter_pets_by_species(agent, 'cat');

    // Then: only pet entries with species "cat" are shown
    helper.then_pets_filtered_by_species(response, 'cat');
    helper.then_pet_gallery_contains(response, 1);
  });

  it('species filter applied — only matching pets shown for Reptile', async () => {
    // Given: pet gallery contains pets of multiple species
    const agent = helper.createSessionAgent();

    // When: customer selects the species filter "reptile"
    const response = await helper.when_filter_pets_by_species(agent, 'reptile');

    // Then: only pet entries with species "reptile" are shown
    helper.then_pets_filtered_by_species(response, 'reptile');
    helper.then_pet_gallery_contains(response, 1);
  });

  it('no available pets for selected species — empty state with options', async () => {
    // Given: pet gallery has no pet entries with species "bird" and lifecycleState "available"
    const agent = helper.createSessionAgent();

    // When: customer selects the species filter "bird"
    const response = await helper.when_filter_pets_by_species(agent, 'bird');

    // Then: gallery shows empty state
    helper.then_pet_gallery_contains(response, 0);
  });

  it('adopted pets excluded from gallery listing', async () => {
    // Given: PET-005 is adopted
    const agent = helper.createSessionAgent();

    // When: customer opens the pet gallery
    const response = await helper.when_browse_pet_gallery(agent);

    // Then: only available pets shown (4 available, 1 adopted excluded)
    helper.then_pet_gallery_contains(response, 4);
  });
});
