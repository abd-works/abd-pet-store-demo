/**
 * Retry Failed Payment — server tests (Increment 5)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { PayYourWayServerHelper } from '../helpers/pay-your-way.server';

describe('Retry Failed Payment', () => {
  const helper = new PayYourWayServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Retry Failed Payment — AC 1: transient auto-retry with indicator', async () => {
    const agent = helper.createSessionAgent();
    const orderNumber = await helper.given_pending_click_and_collect_order(agent);
    const first = await helper.when_pay_transient_error(agent, orderNumber);
    expect(first.status).toBe(503);
    expect(first.body.retrying).toBe(true);
    const statusRes = await helper.when_get_payment_retry_status(agent, orderNumber);
    expect(statusRes.status).toBe(200);
    expect(statusRes.body.retrying).toBe(true);
    expect(statusRes.body.attemptCount).toBeGreaterThanOrEqual(1);
    const autoRetry = await helper.when_get_order(agent, orderNumber);
    helper.then_order_status(autoRetry, 'pending_payment');
    expect(autoRetry.body.automaticPaymentRetryInProgress).toBe(true);
  });

  it('Retry Failed Payment — AC 2: retry success confirms order', async () => {
    const agent = helper.createSessionAgent();
    const orderNumber = await helper.given_pending_click_and_collect_order(agent);
    await helper.when_pay_transient_error(agent, orderNumber);
    const retryPay = await helper.when_pay_order(agent, orderNumber, '4242424242424242');
    expect(retryPay.status).toBe(200);
    helper.then_order_status(retryPay, 'confirmed');
    helper.then_confirmation_email_sent(retryPay);
  });

  it('Retry Failed Payment — AC 3: retry exhaustion restores selector', async () => {
    const agent = helper.createSessionAgent();
    const orderNumber = await helper.given_pending_click_and_collect_order(agent);
    await helper.when_pay_transient_error(agent, orderNumber);
    await helper.when_pay_transient_error(agent, orderNumber);
    const final = await helper.when_pay_transient_error(agent, orderNumber);
    expect(final.status).toBe(409);
    expect(final.body.retryExhausted).toBe(true);
    expect(final.body.restoreSelector).toBe(true);
    const statusRes = await helper.when_get_payment_retry_status(agent, orderNumber);
    expect(statusRes.body.exhausted).toBe(true);
  });

  it('Retry Failed Payment — AC 4: hard decline no auto-retry immediate alternatives', async () => {
    const agent = helper.createSessionAgent();
    const orderNumber = await helper.given_pending_click_and_collect_order(agent);
    const payRes = await helper.when_pay_order(agent, orderNumber, '4242424242420002');
    expect(payRes.status).toBe(402);
    expect(payRes.body.hardDecline).toBe(true);
    expect(payRes.body.retrying).toBeUndefined();
    const statusRes = await helper.when_get_payment_retry_status(agent, orderNumber);
    expect(statusRes.status).toBe(200);
    expect(statusRes.body.hardDecline).toBe(true);
    expect(statusRes.body.retrying).toBe(false);
  });

  it('Retry Failed Payment — AC 5: background retry notification outcomes', async () => {
    const agent = helper.createSessionAgent();
    const orderNumber = await helper.given_pending_click_and_collect_order(agent);
    await helper.when_pay_transient_error(agent, orderNumber);
    const notifyRes = await agent.post(`/api/notifications/payment-retry/${orderNumber}/complete`).send({
      outcome: 'success',
    });
    expect(notifyRes.status).toBe(200);
    expect(notifyRes.body.notificationChannel).toBe('email');
    const orderRes = await helper.when_get_order(agent, orderNumber);
    helper.then_order_status(orderRes, 'confirmed');
    helper.then_confirmation_email_sent(orderRes);
  });
});
