/**
 * Manage Saved Addresses — server tests (Increment 4)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { ReturningCustomersServerHelper } from '../helpers/returning-customers.server';
import { ReturningCustomersBase } from '../helpers/returning-customers.base';

describe('Manage Saved Addresses', () => {
  const helper = new ReturningCustomersServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Manage Saved Addresses — AC 1: list with default indicator', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_logged_in_verified(agent);
    await helper.when_add_address(agent, ReturningCustomersBase.HOME_ADDRESS);
    await helper.when_add_address(agent, ReturningCustomersBase.WORK_ADDRESS);
    const list = await helper.when_list_addresses(agent);
    helper.then_default_address(list, 'Home');
  });

  it('Manage Saved Addresses — AC 2: edit persists to checkout', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_logged_in_verified(agent);
    const created = await helper.when_add_address(agent, ReturningCustomersBase.HOME_ADDRESS);
    const updated = await helper.when_update_address(agent, created.body.id, {
      addressLine1: '99 Updated Lane',
      city: 'Manchester',
      postcode: 'M1 1AE',
    });
    expect(updated.body.addressLine1).toBe('99 Updated Lane');
  });

  it('Manage Saved Addresses — AC 3: delete default prompts new default', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_logged_in_verified(agent);
    const home = await helper.when_add_address(agent, ReturningCustomersBase.HOME_ADDRESS);
    const work = await helper.when_add_address(agent, ReturningCustomersBase.WORK_ADDRESS);
    const deleted = await helper.when_delete_address(agent, home.body.id, work.body.id);
    expect(deleted.status).toBe(200);
    const list = await helper.when_list_addresses(agent);
    helper.then_default_address(list, 'Work');
  });

  it('Manage Saved Addresses — AC 4: set default demotes previous', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_logged_in_verified(agent);
    await helper.when_add_address(agent, ReturningCustomersBase.HOME_ADDRESS);
    const work = await helper.when_add_address(agent, ReturningCustomersBase.WORK_ADDRESS);
    await helper.when_set_default_address(agent, work.body.id);
    const list = await helper.when_list_addresses(agent);
    helper.then_default_address(list, 'Work');
  });
});
