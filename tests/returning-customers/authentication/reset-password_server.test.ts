/**
 * Reset Password — server tests (Increment 4)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { ReturningCustomersServerHelper } from '../helpers/returning-customers.server';
import { ReturningCustomersBase } from '../helpers/returning-customers.base';

describe('Reset Password', () => {
  const helper = new ReturningCustomersServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Reset Password — AC 1: enumeration-safe confirmation', async () => {
    const known = await helper.when_request_password_reset(ReturningCustomersBase.JANE.email);
    helper.then_reset_confirmation(known);
    const unknown = await helper.when_request_password_reset('nobody@example.com');
    helper.then_reset_confirmation(unknown);
  });

  it('Reset Password — AC 2: valid link opens form', async () => {
    await helper.given_registered_unverified(ReturningCustomersBase.TOM_UNVERIFIED);
    await helper.mark_verified(ReturningCustomersBase.TOM_UNVERIFIED.email);
    await helper.when_request_password_reset(ReturningCustomersBase.TOM_UNVERIFIED.email);
    const token = await helper.fetch_reset_token(ReturningCustomersBase.TOM_UNVERIFIED.email);
    const validate = await helper.when_validate_reset_token(token!);
    expect(validate.body.valid).toBe(true);
  });

  it('Reset Password — AC 3: password update invalidates sessions', async () => {
    const mobile = helper.createSessionAgent();
    const laptop = helper.createSessionAgent();
    await helper.given_logged_in_verified(mobile);
    await helper.given_logged_in_verified(laptop);
    await helper.when_request_password_reset(ReturningCustomersBase.JANE.email);
    const token = await helper.fetch_reset_token(ReturningCustomersBase.JANE.email);
    await helper.when_confirm_password_reset(token!, 'NewStr0ngP@ss!');
    expect((await helper.when_get_account(mobile)).status).toBe(401);
    expect((await helper.when_get_account(laptop)).status).toBe(401);
  });

  it('Reset Password — AC 4: expired or used link rejected', async () => {
    await helper.given_verified_account(ReturningCustomersBase.SARAH);
    await helper.when_request_password_reset(ReturningCustomersBase.SARAH.email);
    const token = await helper.fetch_reset_token(ReturningCustomersBase.SARAH.email);
    await helper.consume_reset_token(ReturningCustomersBase.SARAH.email);
    const res = await helper.when_validate_reset_token(token!);
    expect(res.body.valid).toBe(false);
    expect(res.body.error).toBe('link already used');
  });
});
