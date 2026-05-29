/**
 * Process Card Payment via StripeWave — server tests (Increment 2)
 */
import assert from 'node:assert/strict';
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { ClickAndCollectServerHelper } from '../helpers/click-and-collect.server';
import { ClickAndCollectBase } from '../helpers/click-and-collect.base';

describe('Process Card Payment via StripeWave', () => {
  const helper = new ClickAndCollectServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Process Card Payment via StripeWave — AC 2: success confirms order', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_cart_with_item(agent, 'PET-HAR-001', 1);
    const orderRes = await helper.when_place_guest_order(
      agent,
      ClickAndCollectBase.VALID_GUEST,
      ClickAndCollectBase.VALID_BILLING,
      'STR-001',
    );
    const orderNumber = orderRes.body.orderNumber as string;
    const payRes = await helper.when_pay_order(agent, orderNumber, '4242424242424242');
    expect(payRes.status).toBe(200);
    helper.then_order_status(payRes, 'confirmed');
    assert.ok(payRes.body.maskedPaymentMethod);
  });

  it('Process Card Payment via StripeWave — AC 5: service unavailable', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_cart_with_item(agent, 'PET-HAR-001', 1);
    const orderRes = await helper.when_place_guest_order(
      agent,
      ClickAndCollectBase.VALID_GUEST,
      ClickAndCollectBase.VALID_BILLING,
      'STR-001',
    );
    const orderNumber = orderRes.body.orderNumber as string;
    const payRes = await helper.when_pay_order(agent, orderNumber, '4242424242420503');
    expect(payRes.status).toBe(503);
    expect(payRes.body.error).toMatch(/unavailable/i);
    expect(payRes.body.retryAfterMs).toBeGreaterThan(0);
  });

  it('Process Card Payment via StripeWave — AC 4: webhook reconciliation', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_cart_with_item(agent, 'PET-HAR-001', 1);
    const orderRes = await helper.when_place_guest_order(
      agent,
      ClickAndCollectBase.VALID_GUEST,
      ClickAndCollectBase.VALID_BILLING,
      'STR-001',
    );
    const orderNumber = orderRes.body.orderNumber as string;
    const webhookRes = await helper.when_webhook_confirmed(orderNumber);
    expect(webhookRes.status).toBe(200);
    const confirmed = await agent.get(`/api/orders/${orderNumber}`).expect(200);
    helper.then_order_status(confirmed, 'confirmed');
  });
});
