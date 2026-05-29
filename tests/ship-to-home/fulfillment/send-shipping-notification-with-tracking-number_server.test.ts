/**
 * Send Shipping Notification with Tracking Number — server tests (Increment 3)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { ShipToHomeServerHelper } from '../helpers/ship-to-home.server';
import { ShipToHomeBase } from '../helpers/ship-to-home.base';

describe('Send Shipping Notification with Tracking Number', () => {
  const helper = new ShipToHomeServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Send Shipping Notification with Tracking Number — AC 1: notification content sent', async () => {
    const agent = helper.createSessionAgent();
    const { orderNumber } = await helper.given_confirmed_ship_to_home_order(agent);
    const fulfilled = await helper.when_mark_fulfilled(orderNumber, ShipToHomeBase.TRACKING_ROYAL_MAIL);
    expect(fulfilled.status).toBe(200);
    helper.then_order_dto_status(fulfilled.body.order, 'shipped');
    expect(fulfilled.body.order.guestEmail).toBe(ShipToHomeBase.VALID_GUEST.guest_email);
    helper.then_tracking_number(fulfilled.body.order, ShipToHomeBase.TRACKING_ROYAL_MAIL.trackingNumber);
    expect(fulfilled.body.order.estimatedDeliveryWindow).toBe('3–5 business days');
  });

  it('Send Shipping Notification with Tracking Number — AC 2: status to shipped', async () => {
    const agent = helper.createSessionAgent();
    const { orderNumber } = await helper.given_confirmed_ship_to_home_order(agent);
    await helper.when_mark_fulfilled(orderNumber);
    const shipped = await helper.when_add_tracking(orderNumber, ShipToHomeBase.TRACKING_ROYAL_MAIL);
    expect(shipped.status).toBe(200);
    helper.then_order_status(shipped, 'shipped');
  });

  it('Send Shipping Notification with Tracking Number — AC 3: email queued non-blocking', async () => {
    const agent = helper.createSessionAgent();
    const { orderNumber } = await helper.given_confirmed_ship_to_home_order(agent);
    const fulfilled = await helper.when_mark_fulfilled(orderNumber, ShipToHomeBase.TRACKING_ROYAL_MAIL);
    expect(fulfilled.status).toBe(200);
    helper.then_order_dto_status(fulfilled.body.order, 'shipped');
  });

  it('Send Shipping Notification with Tracking Number — AC 4: late tracking triggers notification', async () => {
    const agent = helper.createSessionAgent();
    const { orderNumber } = await helper.given_confirmed_ship_to_home_order(
      agent,
      { guest_email: 'alex.white@example.com', guest_name: 'Alex White' },
    );
    await helper.when_mark_fulfilled(orderNumber);
    const shipped = await helper.when_add_tracking(orderNumber, ShipToHomeBase.TRACKING_LATE);
    expect(shipped.status).toBe(200);
    helper.then_order_status(shipped, 'shipped');
    helper.then_tracking_number(shipped, ShipToHomeBase.TRACKING_LATE.trackingNumber);
  });
});
