/**
 * Add Product to Cart — server tests (Increment 2)
 */
import { describe, it, beforeEach, afterEach } from 'vitest';
import { ClickAndCollectServerHelper } from '../helpers/click-and-collect.server';

describe('Add Product to Cart', () => {
  const helper = new ClickAndCollectServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Add Product to Cart — AC 2: merges duplicate SKU', async () => {
    const agent = helper.createSessionAgent();
    await helper.when_add_to_cart(agent, 'PET-HAR-001', 1);
    const response = await helper.when_add_to_cart(agent, 'PET-HAR-001', 1);
    helper.then_cart_has_line(response, 'PET-HAR-001', 2);
    helper.then_cart_item_count(response, 2);
    helper.then_cart_line_count(response, 1);
  });

  it('Add Product to Cart — AC 4: separate lines per product', async () => {
    const agent = helper.createSessionAgent();
    await helper.when_add_to_cart(agent, 'PET-HAR-001', 1);
    await helper.when_add_to_cart(agent, 'PET-TRT-042', 1);
    const cart = await agent.get('/api/cart').expect(200);
    helper.then_cart_line_count(cart, 2);
    helper.then_cart_item_count(cart, 2);
    helper.then_cart_subtotal(cart, 39.98);
  });

  it('Add Product to Cart — AC 5: session-scoped cart', async () => {
    const sessionA = helper.createSessionAgent();
    await helper.when_add_to_cart(sessionA, 'PET-HAR-001', 1);
    const sessionB = helper.createSessionAgent();
    const cart = await sessionB.get('/api/cart').expect(200);
    helper.then_cart_item_count(cart, 0);
    helper.then_cart_line_count(cart, 0);
  });
});
