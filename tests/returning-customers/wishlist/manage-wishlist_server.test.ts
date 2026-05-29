/**
 * Manage Wishlist — server tests (Increment 4)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { ReturningCustomersServerHelper } from '../helpers/returning-customers.server';
import { ReturningCustomersBase } from '../helpers/returning-customers.base';

describe('Manage Wishlist', () => {
  const helper = new ReturningCustomersServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Manage Wishlist — AC 1: add toggles control state', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_verified_customer(agent);
    const add = await helper.when_add_wishlist_item(agent, 'PET-HAR-001');
    expect(add.status).toBe(201);
    const contains = await agent.get('/api/wishlist/PET-HAR-001/contains');
    expect(contains.body.inWishlist).toBe(true);
  });

  it('Manage Wishlist — AC 2: list with stock availability', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_verified_customer(agent);
    await helper.when_add_wishlist_item(agent, 'PET-HAR-001');
    await helper.when_add_wishlist_item(agent, 'PET-FLT-099');
    const list = await helper.when_list_wishlist(agent);
    expect(list.body.items.length).toBe(2);
    const outOfStock = list.body.items.find((i: { sku: string }) => i.sku === 'PET-FLT-099');
    expect(outOfStock.stockAvailability).toMatch(/out of stock/i);
  });

  it('Manage Wishlist — AC 3: add to cart retains wishlist item', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_verified_customer(agent);
    await helper.when_add_wishlist_item(agent, 'PET-HAR-001');
    await helper.given_cart_with_item(agent, 'PET-HAR-001', 1);
    const list = await helper.when_list_wishlist(agent);
    expect(list.body.items.some((i: { sku: string }) => i.sku === 'PET-HAR-001')).toBe(true);
  });

  it('Manage Wishlist — AC 4: remove resets product control', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_verified_customer(agent);
    await helper.when_add_wishlist_item(agent, 'PET-HAR-001');
    await helper.when_remove_wishlist_item(agent, 'PET-HAR-001');
    const contains = await agent.get('/api/wishlist/PET-HAR-001/contains');
    expect(contains.body.inWishlist).toBe(false);
  });

  it('Manage Wishlist — AC 5: guest dismissible prompt', async () => {
    const agent = helper.createSessionAgent();
    const add = await helper.when_add_wishlist_item(agent, 'PET-HAR-001');
    expect(add.status).toBe(401);
  });
});
