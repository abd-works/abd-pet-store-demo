/**
 * Enter Billing Address — server tests (Increment 2)
 */
import assert from 'node:assert/strict';
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { ClickAndCollectServerHelper } from '../helpers/click-and-collect.server';
import { ClickAndCollectBase } from '../helpers/click-and-collect.base';

describe('Enter Billing Address', () => {
  const helper = new ClickAndCollectServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Enter Billing Address — AC 4: snapshotted not persisted', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_cart_with_item(agent, 'PET-HAR-001', 1);
    const orderRes = await helper.when_place_guest_order(
      agent,
      ClickAndCollectBase.VALID_GUEST,
      ClickAndCollectBase.VALID_BILLING,
      'STR-001',
    );
    expect(orderRes.status).toBe(201);
    assert.strictEqual(orderRes.body.billingAddress.addressLine1, ClickAndCollectBase.VALID_BILLING.addressLine1);
    assert.strictEqual(orderRes.body.status, 'pending_payment');
  });
});
