/**
 * Update Cart Quantity — server tests (Increment 2)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { ClickAndCollectServerHelper } from '../helpers/click-and-collect.server';

describe('Update Cart Quantity', () => {
  const helper = new ClickAndCollectServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Update Cart Quantity — AC 4: rejects over stock', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_cart_with_item(agent, 'PET-HAR-001', 2);
    const response = await helper.when_update_quantity(agent, 'PET-HAR-001', 25);
    expect(response.status).toBe(409);
    const cart = await agent.get('/api/cart').expect(200);
    helper.then_cart_has_line(cart, 'PET-HAR-001', 2);
  });
});
