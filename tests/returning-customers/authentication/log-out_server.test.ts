/**
 * Log Out — server tests (Increment 4)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { ReturningCustomersServerHelper } from '../helpers/returning-customers.server';

describe('Log Out', () => {
  const helper = new ReturningCustomersServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Log Out — AC 1: current session invalidated', async () => {
    const mobile = helper.createSessionAgent();
    const laptop = helper.createSessionAgent();
    await helper.given_logged_in_verified(mobile);
    await helper.given_logged_in_verified(laptop);
    await helper.when_logout(mobile);
    expect((await helper.when_get_account(mobile)).status).toBe(401);
    expect((await helper.when_get_account(laptop)).status).toBe(200);
  });

  it('Log Out — AC 2: single device vs log out everywhere', async () => {
    const mobile = helper.createSessionAgent();
    const laptop = helper.createSessionAgent();
    await helper.given_logged_in_verified(mobile);
    await helper.given_logged_in_verified(laptop);
    await helper.when_logout_everywhere(mobile);
    expect((await helper.when_get_account(mobile)).status).toBe(401);
    expect((await helper.when_get_account(laptop)).status).toBe(401);
  });
});
