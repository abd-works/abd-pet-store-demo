/**
 * Track Order Status — server tests (Increment 3)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { ShipToHomeServerHelper } from '../helpers/ship-to-home.server';
import { ShipToHomeBase } from '../helpers/ship-to-home.base';

describe('Track Order Status', () => {
  const helper = new ShipToHomeServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Track Order Status — AC 3: guest lookup match and fail closed', async () => {
    const agent = helper.createSessionAgent();
    const { orderNumber } = await helper.given_confirmed_ship_to_home_order(agent);

    const match = await helper.when_lookup_order(orderNumber, ShipToHomeBase.VALID_GUEST.guest_email);
    expect(match.status).toBe(200);
    expect(match.body.orderNumber).toBe(orderNumber);

    const mismatch = await helper.when_lookup_order(orderNumber, ShipToHomeBase.WRONG_GUEST_EMAIL);
    expect(mismatch.status).toBe(404);
  });

  it('Track Order Status — AC 4: pre-ship tracking pending message', async () => {
    const agent = helper.createSessionAgent();
    const { orderNumber } = await helper.given_confirmed_ship_to_home_order(agent);
    const statusRes = await helper.when_get_order_status(orderNumber);
    expect(statusRes.status).toBe(200);
    helper.then_status_label(statusRes, 'Confirmed');
    helper.then_tracking_pending_message(statusRes, 'Tracking will be available once your order ships');
  });

  it('Track Order Status — AC 2: tracking and carrier link', async () => {
    const agent = helper.createSessionAgent();
    const { orderNumber } = await helper.given_confirmed_ship_to_home_order(agent);
    await helper.when_mark_fulfilled(orderNumber, ShipToHomeBase.TRACKING_ROYAL_MAIL);
    const statusRes = await helper.when_get_order_status(orderNumber);
    expect(statusRes.status).toBe(200);
    helper.then_status_label(statusRes, 'Shipped');
    expect(statusRes.body.tracking.number).toBe(ShipToHomeBase.TRACKING_ROYAL_MAIL.trackingNumber);
    expect(statusRes.body.tracking.carrierTrackingUrl).toContain('royalmail');
  });

  it('Track Order Status — AC 5: refresh on revisit no push', async () => {
    const agent = helper.createSessionAgent();
    const { orderNumber } = await helper.given_confirmed_ship_to_home_order(agent);
    await helper.when_mark_fulfilled(orderNumber, ShipToHomeBase.TRACKING_ROYAL_MAIL);
    const first = await helper.when_get_order_status(orderNumber);
    helper.then_status_label(first, 'Shipped');
    const second = await helper.when_get_order_status(orderNumber);
    helper.then_status_label(second, 'Shipped');
  });
});
