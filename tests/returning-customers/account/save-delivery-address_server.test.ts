/**
 * Save Delivery Address — server tests (Increment 4)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { ReturningCustomersServerHelper } from '../helpers/returning-customers.server';
import { ReturningCustomersBase } from '../helpers/returning-customers.base';

describe('Save Delivery Address', () => {
  const helper = new ReturningCustomersServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Save Delivery Address — AC 1: checkout save opt-in', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_logged_in_verified(agent);
    const res = await helper.when_add_address(agent, ReturningCustomersBase.HOME_ADDRESS);
    expect(res.status).toBe(201);
  });

  it('Save Delivery Address — AC 2: first address auto-default', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_logged_in_verified(agent);
    const res = await helper.when_add_address(agent, ReturningCustomersBase.HOME_ADDRESS);
    helper.then_address_default(res, true);
  });

  it('Save Delivery Address — AC 3: additional entry non-destructive', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_logged_in_verified(agent);
    await helper.when_add_address(agent, ReturningCustomersBase.HOME_ADDRESS);
    const second = await helper.when_add_address(agent, ReturningCustomersBase.WORK_ADDRESS);
    expect(second.status).toBe(201);
    const list = await helper.when_list_addresses(agent);
    helper.then_address_count(list, 2);
  });
});
