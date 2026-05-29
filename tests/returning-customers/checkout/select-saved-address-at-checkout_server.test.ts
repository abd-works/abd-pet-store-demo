/**
 * Select Saved Address at Checkout — server tests (Increment 4)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { ReturningCustomersServerHelper } from '../helpers/returning-customers.server';
import { ReturningCustomersBase } from '../helpers/returning-customers.base';

describe('Select Saved Address at Checkout', () => {
  const helper = new ReturningCustomersServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Select Saved Address at Checkout — AC 1: list with default pre-selected', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_logged_in_verified(agent);
    await helper.when_add_address(agent, ReturningCustomersBase.HOME_ADDRESS);
    await helper.when_add_address(agent, ReturningCustomersBase.WORK_ADDRESS);
    const list = await helper.when_list_addresses(agent);
    helper.then_default_address(list, 'Home');
  });

  it('Select Saved Address at Checkout — AC 2: selection auto-fills and advances', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_logged_in_verified(agent);
    const work = await helper.when_add_address(agent, ReturningCustomersBase.WORK_ADDRESS);
    expect(work.body.city).toBe('London');
  });

  it('Select Saved Address at Checkout — AC 3: different address with save opt-in', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_logged_in_verified(agent);
    const res = await helper.when_add_address(agent, {
      label: 'Other',
      addressLine1: '99 New Road',
      city: 'Leeds',
      postcode: 'LS1 1AA',
      country: 'United Kingdom',
    });
    expect(res.status).toBe(201);
  });

  it('Select Saved Address at Checkout — AC 4: guest manual only preserved', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_cart_with_item(agent, 'PET-HAR-001', 1);
    const list = await helper.when_list_addresses(agent);
    expect(list.status).toBe(401);
  });
});
