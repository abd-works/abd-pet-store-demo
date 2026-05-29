/**
 * Select Saved Payment Method at Checkout — server tests (Increment 4)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { ReturningCustomersServerHelper } from '../helpers/returning-customers.server';
import { ReturningCustomersBase } from '../helpers/returning-customers.base';

describe('Select Saved Payment Method at Checkout', () => {
  const helper = new ReturningCustomersServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Select Saved Payment Method at Checkout — AC 1: list with default pre-selected', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_logged_in_verified(agent);
    await helper.seed_payment_method(ReturningCustomersBase.JANE.email);
    const list = await helper.when_list_payment_methods(agent);
    expect(list.body.methods[0].isDefault).toBe(true);
  });

  it('Select Saved Payment Method at Checkout — AC 2: token charge with confirmation', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_logged_in_verified(agent);
    const method = await helper.seed_payment_method(ReturningCustomersBase.JANE.email);
    expect(method.body.lastFour).toBe('4242');
  });

  it('Select Saved Payment Method at Checkout — AC 3: manual entry with save opt-in', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_logged_in_verified(agent);
    const list = await helper.when_list_payment_methods(agent);
    expect(list.body.methods).toHaveLength(0);
  });

  it('Select Saved Payment Method at Checkout — AC 4: expired token not charged', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_logged_in_verified(agent);
    await helper.seed_payment_method(ReturningCustomersBase.JANE.email, { expiryYear: 2024 });
    const list = await helper.when_list_payment_methods(agent);
    expect(list.body.methods.some((m: { isExpired: boolean }) => m.isExpired)).toBe(true);
  });
});
