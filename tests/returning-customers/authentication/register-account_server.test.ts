/**
 * Register Account — server tests (Increment 4)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { ReturningCustomersServerHelper } from '../helpers/returning-customers.server';
import { ReturningCustomersBase } from '../helpers/returning-customers.base';

describe('Register Account', () => {
  const helper = new ReturningCustomersServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Register Account — AC 1: form collects credentials with requirements visible', async () => {
    const res = await helper.when_register({
      ...ReturningCustomersBase.NEW_USER,
      email: 'form-check@example.com',
    });
    expect(res.status).toBe(201);
    helper.then_registration_confirmation(res);
  });

  it('Register Account — AC 2: creates unverified account and confirmation', async () => {
    const res = await helper.given_registered_unverified(ReturningCustomersBase.NEW_USER);
    helper.then_registration_confirmation(res);
    const account = await helper.when_login(
      helper.createSessionAgent(),
      ReturningCustomersBase.NEW_USER.email,
      ReturningCustomersBase.NEW_USER.password,
    );
    helper.then_unverified_login_blocked(account);
  });

  it('Register Account — AC 3: duplicate email enumeration-safe error', async () => {
    await helper.given_registered_account(ReturningCustomersBase.JANE);
    const dup = await helper.when_register(ReturningCustomersBase.JANE);
    helper.then_duplicate_email_error(dup);
  });

  it('Register Account — AC 4: password requirements block creation', async () => {
    for (const { password, unmet } of ReturningCustomersBase.weakPasswordCases()) {
      const res = await helper.when_register({
        ...ReturningCustomersBase.NEW_USER,
        email: `weak-${password}@example.com`,
        password,
      });
      helper.then_unmet_password_requirements(res, unmet);
    }
  });
});
