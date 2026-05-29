/**
 * Reorder Previous Purchase — server tests (Increment 4)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { ReturningCustomersServerHelper } from '../helpers/returning-customers.server';
import { ReturningCustomersBase } from '../helpers/returning-customers.base';

describe('Reorder Previous Purchase', () => {
  const helper = new ReturningCustomersServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Reorder Previous Purchase — AC 1: reorder navigates to cart', async () => {
    const guestAgent = helper.createSessionAgent();
    const accountAgent = helper.createSessionAgent();
    const { orderNumber } = await helper.given_confirmed_ship_to_home_for_email(
      guestAgent,
      ReturningCustomersBase.JANE.email,
    );
    await helper.given_logged_in_verified(accountAgent);
    const reorder = await helper.when_reorder(accountAgent, orderNumber);
    expect(reorder.status).toBe(200);
    expect(reorder.body.addedSkus.length).toBeGreaterThan(0);
    await helper.then_cart_quantity(accountAgent, reorder.body.addedSkus[0], 1);
  });

  it('Reorder Previous Purchase — AC 2: delisted partial success message', async () => {
    const sku = ReturningCustomersBase.SKU_DOG_FOOD;
    const guestAgent = helper.createSessionAgent();
    const accountAgent = helper.createSessionAgent();
    const { orderNumber } = await helper.given_confirmed_ship_to_home_for_email(
      guestAgent,
      ReturningCustomersBase.JANE.email,
      sku,
    );
    await helper.when_delist_product(sku);
    await helper.given_logged_in_verified(accountAgent);
    const reorder = await helper.when_reorder(accountAgent, orderNumber);
    expect(reorder.body.skippedSkus).toContain(sku);
  });

  it('Reorder Previous Purchase — AC 3: out of stock warning options', async () => {
    const sku = 'PET-FLT-099';
    const guestAgent = helper.createSessionAgent();
    const accountAgent = helper.createSessionAgent();
    await helper.when_set_store_stock(sku, 'STR-001', 10);
    await helper.when_set_store_stock(sku, 'STR-002', 10);
    const { orderNumber } = await helper.given_confirmed_ship_to_home_for_email(
      guestAgent,
      ReturningCustomersBase.JANE.email,
      sku,
    );
    await helper.when_set_store_stock(sku, 'STR-001', 0);
    await helper.when_set_store_stock(sku, 'STR-002', 0);
    await helper.given_logged_in_verified(accountAgent);
    const reorder = await helper.when_reorder(accountAgent, orderNumber);
    expect(reorder.body.stockWarnings.length).toBeGreaterThan(0);
  });

  it('Reorder Previous Purchase — AC 4: merge sums quantities', async () => {
    const guestAgent = helper.createSessionAgent();
    const accountAgent = helper.createSessionAgent();
    const { orderNumber } = await helper.given_confirmed_ship_to_home_for_email(
      guestAgent,
      ReturningCustomersBase.JANE.email,
    );
    await helper.given_logged_in_verified(accountAgent);
    await helper.given_cart_with_item(accountAgent, 'PET-HAR-001', 1);
    const reorder = await helper.when_reorder(accountAgent, orderNumber);
    expect(reorder.status).toBe(200);
    await helper.then_cart_quantity(accountAgent, 'PET-HAR-001', 2);
  });
});
