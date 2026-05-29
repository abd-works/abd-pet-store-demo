/**
 * Save Payment Method — server tests (Increment 4)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { ReturningCustomersServerHelper } from '../helpers/returning-customers.server';
import { ReturningCustomersBase } from '../helpers/returning-customers.base';

describe('Save Payment Method', () => {
  const helper = new ReturningCustomersServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Save Payment Method — AC 1: checkout save via token', async () => {
    await helper.given_verified_account(ReturningCustomersBase.JANE);
    const res = await helper.seed_payment_method(ReturningCustomersBase.JANE.email);
    expect(res.status).toBe(201);
    expect(res.body.vendorToken).toBeUndefined();
  });

  it('Save Payment Method — AC 2: display metadata without raw card', async () => {
    await helper.given_verified_account(ReturningCustomersBase.JANE);
    const res = await helper.seed_payment_method(ReturningCustomersBase.JANE.email, { lastFour: '4242' });
    expect(res.body.lastFour).toBe('4242');
    expect(res.body.cardType).toBe('Visa');
    expect(res.body.rawCardNumber).toBeUndefined();
  });

  it('Save Payment Method — AC 3: second method retains first default', async () => {
    await helper.given_verified_account(ReturningCustomersBase.JANE);
    const first = await helper.seed_payment_method(ReturningCustomersBase.JANE.email, { lastFour: '4242' });
    const second = await helper.seed_payment_method(ReturningCustomersBase.JANE.email, {
      lastFour: '5555',
      vendorToken: 'tok_sw_5555',
    });
    expect(first.body.isDefault).toBe(true);
    expect(second.body.isDefault).toBe(false);
  });
});
