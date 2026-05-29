/**
 * Log In — server tests (Increment 4)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { ReturningCustomersServerHelper } from '../helpers/returning-customers.server';
import { ReturningCustomersBase } from '../helpers/returning-customers.base';

describe('Log In', () => {
  const helper = new ReturningCustomersServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Log In — AC 1: session created and redirect', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_verified_account(ReturningCustomersBase.JANE);
    const login = await helper.when_login(agent, ReturningCustomersBase.JANE.email, ReturningCustomersBase.JANE.password);
    helper.then_login_success(login, ReturningCustomersBase.JANE.email);
    const account = await helper.when_get_account(agent);
    helper.then_account_verified(account);
  });

  it('Log In — AC 2: generic credential error', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_verified_account(ReturningCustomersBase.JANE);
    const login = await helper.when_login(agent, ReturningCustomersBase.JANE.email, 'WrongP@ss1!');
    helper.then_login_invalid_credentials(login);
  });

  it('Log In — AC 3: unverified blocked with resend', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_registered_unverified(ReturningCustomersBase.TOM_UNVERIFIED);
    const login = await helper.when_login(
      agent,
      ReturningCustomersBase.TOM_UNVERIFIED.email,
      ReturningCustomersBase.TOM_UNVERIFIED.password,
    );
    helper.then_unverified_login_blocked(login);
  });

  it('Log In — AC 4: guest cart merge sums quantities', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_account_cart_item(
      ReturningCustomersBase.JANE.email,
      ReturningCustomersBase.SKU_DOG_FOOD,
      1,
    );
    await helper.given_cart_with_item(agent, ReturningCustomersBase.SKU_DOG_FOOD, 2);
    await helper.given_verified_account(ReturningCustomersBase.JANE);
    await helper.when_login(agent, ReturningCustomersBase.JANE.email, ReturningCustomersBase.JANE.password);
    await helper.then_cart_quantity(agent, ReturningCustomersBase.SKU_DOG_FOOD, 3);
  });
});
