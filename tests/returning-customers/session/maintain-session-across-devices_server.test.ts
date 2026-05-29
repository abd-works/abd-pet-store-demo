/**
 * Maintain Session Across Devices — server tests (Increment 4)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { ReturningCustomersServerHelper } from '../helpers/returning-customers.server';
import { ReturningCustomersBase } from '../helpers/returning-customers.base';

describe('Maintain Session Across Devices', () => {
  const helper = new ReturningCustomersServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Maintain Session Across Devices — AC 1: concurrent sessions', async () => {
    const mobile = helper.createSessionAgent();
    const laptop = helper.createSessionAgent();
    await helper.given_logged_in_verified(mobile);
    await helper.given_logged_in_verified(laptop);
    expect(await helper.session_count(ReturningCustomersBase.JANE.email)).toBeGreaterThanOrEqual(2);
    expect((await helper.when_get_account(mobile)).status).toBe(200);
    expect((await helper.when_get_account(laptop)).status).toBe(200);
  });

  it('Maintain Session Across Devices — AC 2: expiry redirect preserves cart', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_logged_in_verified(agent);
    await helper.given_cart_with_item(agent, ReturningCustomersBase.SKU_DOG_FOOD, 2);
    const accountRes = await helper.when_expire_current_session(agent, ReturningCustomersBase.JANE.email);
    expect(accountRes.status).toBe(401);
    const cartAfter = await agent.get('/api/cart');
    expect(cartAfter.body.items.some((i: { sku: string }) => i.sku === ReturningCustomersBase.SKU_DOG_FOOD)).toBe(true);
  });

  it('Maintain Session Across Devices — AC 3: password reset cascade', async () => {
    const mobile = helper.createSessionAgent();
    const laptop = helper.createSessionAgent();
    await helper.given_logged_in_verified(mobile);
    await helper.given_logged_in_verified(laptop);
    await helper.when_request_password_reset(ReturningCustomersBase.JANE.email);
    const token = await helper.fetch_reset_token(ReturningCustomersBase.JANE.email);
    await helper.when_confirm_password_reset(token!, 'CascadeP@ss1!');
    expect((await helper.when_get_account(mobile)).status).toBe(401);
    expect((await helper.when_get_account(laptop)).status).toBe(401);
  });
});
