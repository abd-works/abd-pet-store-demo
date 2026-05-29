/**
 * Send Email Verification — server tests (Increment 4)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { ReturningCustomersServerHelper } from '../helpers/returning-customers.server';
import { ReturningCustomersBase } from '../helpers/returning-customers.base';

describe('Send Email Verification', () => {
  const helper = new ReturningCustomersServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Send Email Verification — AC 1: email with unique link sent', async () => {
    await helper.given_registered_unverified(ReturningCustomersBase.TOM_UNVERIFIED);
    const token = await helper.fetch_verification_token(ReturningCustomersBase.TOM_UNVERIFIED.email);
    expect(token).toBeTruthy();
  });

  it('Send Email Verification — AC 2: expired link resend offered', async () => {
    await helper.given_registered_unverified(ReturningCustomersBase.TOM_UNVERIFIED);
    const token = await helper.fetch_verification_token(ReturningCustomersBase.TOM_UNVERIFIED.email);
    await helper.expire_verification_token(token!);
    const res = await helper.when_verify_email(token!);
    expect(res.status).toBe(410);
    expect(res.body.error).toMatch(/expired/i);
  });

  it('Send Email Verification — AC 3: queued retry messaging on confirmation', async () => {
    const res = await helper.when_register({
      ...ReturningCustomersBase.SARAH,
      email: 'queued@example.com',
    });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('check your email to verify');
  });
});
