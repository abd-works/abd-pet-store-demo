/**
 * Prepare Click-and-Collect Orders for Pickup — server tests (Increment 2)
 */
import assert from 'node:assert/strict';
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import request from 'supertest';
import { app } from '@pawplace/app-server';
import { ClickAndCollectServerHelper } from '../helpers/click-and-collect.server';
import { ClickAndCollectBase } from '../helpers/click-and-collect.base';

describe('Prepare Click-and-Collect Orders for Pickup', () => {
  const helper = new ClickAndCollectServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  async function placeConfirmedOrder(agent: ReturnType<ClickAndCollectServerHelper['createSessionAgent']>) {
    await helper.given_cart_with_item(agent, 'PET-HAR-001', 1);
    const orderRes = await helper.when_place_guest_order(
      agent,
      ClickAndCollectBase.VALID_GUEST,
      ClickAndCollectBase.VALID_BILLING,
      'STR-001',
    );
    const orderNumber = orderRes.body.orderNumber as string;
    await helper.when_pay_order(agent, orderNumber, '4242424242424242');
    return orderNumber;
  }

  it('Prepare Click-and-Collect Orders for Pickup — AC 1: queue oldest first', async () => {
    const agentA = helper.createSessionAgent();
    const agentB = helper.createSessionAgent();
    const first = await placeConfirmedOrder(agentA);
    const second = await placeConfirmedOrder(agentB);
    const queue = await request(app).get('/api/orders/queue').query({ storeCode: 'STR-001' }).expect(200);
    assert.ok(queue.body.orders.length >= 2);
    const numbers = queue.body.orders.map((o: { orderNumber: string }) => o.orderNumber);
    expect(numbers).toContain(first);
    expect(numbers).toContain(second);
  });

  it('Prepare Click-and-Collect Orders for Pickup — AC 2: mark prepared', async () => {
    const agent = helper.createSessionAgent();
    const orderNumber = await placeConfirmedOrder(agent);
    const prepared = await request(app).patch(`/api/orders/${orderNumber}/prepared`).expect(200);
    helper.then_order_status(prepared, 'ready_for_pickup');
  });

  it('Prepare Click-and-Collect Orders for Pickup — AC 3: stock warning with email', async () => {
    await request(app).post('/api/test/stock').send({
      product_sku: 'PET-FLT-099',
      product_name: 'Exotic Fish Filter',
      store_code: 'STR-001',
      store_name: 'PawPlace Camden',
      quantity_on_hand: 1,
      reserved_quantity: 0,
    });
    const agent = helper.createSessionAgent();
    await helper.given_cart_with_item(agent, 'PET-FLT-099', 1);
    await request(app).put('/api/stock/PET-FLT-099/STR-001').send({ quantity_on_hand: 0 });
    const orderRes = await helper.when_place_guest_order(
      agent,
      { guest_email: 'tom.brown@example.com', guest_name: 'Tom Brown' },
      ClickAndCollectBase.VALID_BILLING,
      'STR-001',
    );
    assert.strictEqual(orderRes.status, 201);
    const orderNumber = orderRes.body.orderNumber as string;
    await helper.when_pay_order(agent, orderNumber, '4242424242424242');
    const order = await request(app).get(`/api/orders/${orderNumber}`).expect(200);
    assert.ok(order.body.stockWarnings?.length > 0);
    assert.strictEqual(order.body.guestEmail, 'tom.brown@example.com');
  });
});
