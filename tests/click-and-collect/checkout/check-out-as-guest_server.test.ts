/**
 * Check Out as Guest — server tests (Increment 2)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { ClickAndCollectServerHelper } from '../helpers/click-and-collect.server';
import { ClickAndCollectBase } from '../helpers/click-and-collect.base';

describe('Check Out as Guest', () => {
  const helper = new ClickAndCollectServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Check Out as Guest — AC 2: order placed email sent no account', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_cart_with_item(agent, 'PET-HAR-001', 1);
    const response = await helper.when_place_guest_order(
      agent,
      ClickAndCollectBase.VALID_GUEST,
      ClickAndCollectBase.VALID_BILLING,
      'STR-001',
    );
    expect(response.status).toBe(201);
    helper.then_order_status(response, 'pending_payment');
    helper.then_order_guest_email(response, ClickAndCollectBase.VALID_GUEST.guest_email);
  });
});
