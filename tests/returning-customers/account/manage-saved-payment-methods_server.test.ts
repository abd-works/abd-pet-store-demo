/**
 * Manage Saved Payment Methods — server tests (Increment 4)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { ReturningCustomersServerHelper } from '../helpers/returning-customers.server';
import { ReturningCustomersBase } from '../helpers/returning-customers.base';

describe('Manage Saved Payment Methods', () => {
  const helper = new ReturningCustomersServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Manage Saved Payment Methods — AC 1: list with default indicator', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_logged_in_verified(agent);
    await helper.seed_payment_method(ReturningCustomersBase.JANE.email, { lastFour: '4242' });
    await helper.seed_payment_method(ReturningCustomersBase.JANE.email, {
      lastFour: '5555',
      vendorToken: 'tok_sw_5555',
    });
    const list = await helper.when_list_payment_methods(agent);
    expect(list.body.methods.find((m: { isDefault: boolean }) => m.isDefault)?.lastFour).toBe('4242');
  });

  it('Manage Saved Payment Methods — AC 2: remove default prompts new default', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_logged_in_verified(agent);
    const first = await helper.seed_payment_method(ReturningCustomersBase.JANE.email, { lastFour: '4242' });
    const second = await helper.seed_payment_method(ReturningCustomersBase.JANE.email, {
      lastFour: '5555',
      vendorToken: 'tok_sw_5555',
    });
    const deleted = await helper.when_delete_payment_method(agent, first.body.id, second.body.id);
    expect(deleted.status).toBe(200);
    const list = await helper.when_list_payment_methods(agent);
    expect(list.body.methods[0].isDefault).toBe(true);
    expect(list.body.methods[0].lastFour).toBe('5555');
  });

  it('Manage Saved Payment Methods — AC 3: set default demotes previous', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_logged_in_verified(agent);
    await helper.seed_payment_method(ReturningCustomersBase.JANE.email, { lastFour: '4242' });
    const second = await helper.seed_payment_method(ReturningCustomersBase.JANE.email, {
      lastFour: '5555',
      vendorToken: 'tok_sw_5555',
    });
    await helper.when_set_default_payment_method(agent, second.body.id);
    const list = await helper.when_list_payment_methods(agent);
    expect(list.body.methods.find((m: { lastFour: string }) => m.lastFour === '5555')?.isDefault).toBe(true);
  });
});
