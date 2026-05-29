/**
 * Fulfill Click-and-Collect Order — server tests (Increment 2)
 */
import { describe, it, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { app } from '@pawplace/app-server';
import { ClickAndCollectServerHelper } from '../helpers/click-and-collect.server';
import { ClickAndCollectBase } from '../helpers/click-and-collect.base';

describe('Fulfill Click-and-Collect Order', () => {
  const helper = new ClickAndCollectServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Fulfill Click-and-Collect Order — AC 1: mark collected', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_cart_with_item(agent, 'PET-HAR-001', 1);
    const orderRes = await helper.when_place_guest_order(
      agent,
      ClickAndCollectBase.VALID_GUEST,
      ClickAndCollectBase.VALID_BILLING,
      'STR-001',
    );
    const orderNumber = orderRes.body.orderNumber as string;
    await helper.when_pay_order(agent, orderNumber, '4242424242424242');
    await request(app).patch(`/api/orders/${orderNumber}/prepared`).expect(200);
    const collected = await request(app).patch(`/api/orders/${orderNumber}/collected`).expect(200);
    helper.then_order_status(collected, 'collected');
  });
});
