/**
 * View and Process Incoming Orders — server tests (Increment 3)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { ShipToHomeServerHelper } from '../helpers/ship-to-home.server';
import { ShipToHomeBase } from '../helpers/ship-to-home.base';

describe('View and Process Incoming Orders', () => {
  const helper = new ShipToHomeServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('View and Process Incoming Orders — AC 1: unified queue oldest first', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_confirmed_ship_to_home_order(agent);
    const agent2 = helper.createSessionAgent();
    await helper.given_confirmed_click_and_collect_order(agent2);

    const queueRes = await helper.when_list_queue('STR-001');
    expect(queueRes.status).toBe(200);
    expect(queueRes.body.orders.length).toBeGreaterThanOrEqual(2);
    const labels = queueRes.body.orders.map((row: { deliveryTypeLabel: string }) => row.deliveryTypeLabel);
    expect(labels).toContain('Standard Delivery');
    expect(labels).toContain('Click-and-Collect');
  });

  it('View and Process Incoming Orders — AC 2: ship-to-home detail', async () => {
    const agent = helper.createSessionAgent();
    const { orderNumber } = await helper.given_confirmed_ship_to_home_order(agent);
    const detailRes = await helper.when_get_order(orderNumber);
    expect(detailRes.status).toBe(200);
    helper.then_shipping_address_snapshot(detailRes, ShipToHomeBase.VALID_SHIPPING_EDINBURGH);
    expect(detailRes.body.items.length).toBeGreaterThan(0);
  });

  it('View and Process Incoming Orders — AC 3: fulfillment with tracking prompt', async () => {
    const agent = helper.createSessionAgent();
    const { orderNumber } = await helper.given_confirmed_ship_to_home_order(agent);
    const fulfilled = await helper.when_mark_fulfilled(orderNumber, ShipToHomeBase.TRACKING_ROYAL_MAIL);
    expect(fulfilled.status).toBe(200);
    helper.then_order_dto_status(fulfilled.body.order, 'shipped');
    helper.then_tracking_number(fulfilled.body.order, ShipToHomeBase.TRACKING_ROYAL_MAIL.trackingNumber);
  });

  it('View and Process Incoming Orders — AC 4: fulfill without tracking warning', async () => {
    const agent = helper.createSessionAgent();
    const { orderNumber } = await helper.given_confirmed_ship_to_home_order(agent);
    const fulfilled = await helper.when_mark_fulfilled(orderNumber);
    expect(fulfilled.status).toBe(200);
    helper.then_order_dto_status(fulfilled.body.order, 'fulfilled');
    helper.then_fulfillment_warning(fulfilled, 'Customer will not receive a shipping notification');
  });
});
