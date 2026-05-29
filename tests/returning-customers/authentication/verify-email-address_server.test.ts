/**
 * Verify Email Address — server tests (Increment 4)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { ReturningCustomersServerHelper } from '../helpers/returning-customers.server';
import { ReturningCustomersBase } from '../helpers/returning-customers.base';

describe('Verify Email Address', () => {
  const helper = new ReturningCustomersServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Verify Email Address — AC 1: valid link verifies account', async () => {
    await helper.given_registered_unverified(ReturningCustomersBase.TOM_UNVERIFIED);
    const token = await helper.fetch_verification_token(ReturningCustomersBase.TOM_UNVERIFIED.email);
    const res = await helper.when_verify_email(token!);
    helper.then_verified_outcome(res, 'success');
    const agent = helper.createSessionAgent();
    const login = await helper.when_login(
      agent,
      ReturningCustomersBase.TOM_UNVERIFIED.email,
      ReturningCustomersBase.TOM_UNVERIFIED.password,
    );
    helper.then_login_success(login, ReturningCustomersBase.TOM_UNVERIFIED.email);
  });

  it('Verify Email Address — AC 2: used link idempotent message', async () => {
    await helper.given_verified_account(ReturningCustomersBase.TOM_UNVERIFIED);
    const token = await helper.fetch_verification_token(ReturningCustomersBase.TOM_UNVERIFIED.email);
    const res = await helper.when_verify_email(token!);
    expect(res.body.outcome).toBe('already_verified');
  });

  it('Verify Email Address — AC 3: expired link resend action', async () => {
    await helper.given_registered_unverified(ReturningCustomersBase.TOM_UNVERIFIED);
    const token = await helper.fetch_verification_token(ReturningCustomersBase.TOM_UNVERIFIED.email);
    await helper.expire_verification_token(token!);
    const res = await helper.when_verify_email(token!);
    expect(res.status).toBe(410);
    expect(res.body.resendAvailable).toBe(true);
  });
});
