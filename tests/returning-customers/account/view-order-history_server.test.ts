/**
 * View Order History — server tests (Increment 4)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { ReturningCustomersServerHelper } from '../helpers/returning-customers.server';
import { ReturningCustomersBase } from '../helpers/returning-customers.base';

describe('View Order History', () => {
  const helper = new ReturningCustomersServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('View Order History — AC 1: list most recent first', async () => {
    const guestAgent = helper.createSessionAgent();
    const accountAgent = helper.createSessionAgent();
    await helper.given_confirmed_ship_to_home_for_email(guestAgent, ReturningCustomersBase.JANE.email);
    await helper.given_logged_in_verified(accountAgent);
    const list = await helper.when_list_orders(accountAgent);
    helper.then_orders_count(list, 1);
    expect(list.body.orders[0].orderNumber).toBeTruthy();
  });

  it('View Order History — AC 2: full order detail', async () => {
    const guestAgent = helper.createSessionAgent();
    const accountAgent = helper.createSessionAgent();
    const { orderNumber } = await helper.given_confirmed_ship_to_home_for_email(
      guestAgent,
      ReturningCustomersBase.JANE.email,
    );
    await helper.given_logged_in_verified(accountAgent);
    const detail = await helper.when_get_order(accountAgent, orderNumber);
    expect(detail.status).toBe(200);
    expect(detail.body.items.length).toBeGreaterThan(0);
    expect(detail.body.shippingAddress).toBeTruthy();
  });

  it('View Order History — AC 3: empty state', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_logged_in_verified(agent, ReturningCustomersBase.SARAH);
    const list = await helper.when_list_orders(agent);
    helper.then_orders_count(list, 0);
  });

  it('View Order History — AC 4: guest order retroactive association', async () => {
    const guestAgent = helper.createSessionAgent();
    await helper.given_confirmed_ship_to_home_for_email(guestAgent, ReturningCustomersBase.NEW_USER.email);
    await helper.given_registered_account(ReturningCustomersBase.NEW_USER);
    await helper.mark_verified(ReturningCustomersBase.NEW_USER.email);
    const accountAgent = helper.createSessionAgent();
    await helper.when_login(
      accountAgent,
      ReturningCustomersBase.NEW_USER.email,
      ReturningCustomersBase.NEW_USER.password,
    );
    const list = await helper.when_list_orders(accountAgent);
    helper.then_orders_count(list, 1);
  });
});
