/**
 * Update Cart Quantity — client tests (Increment 2)
 */
import { describe, it, beforeEach, afterEach } from 'vitest';
import { ClickAndCollectClientHelper } from '../helpers/click-and-collect.client';

describe('Update Cart Quantity', () => {
  const helper = new ClickAndCollectClientHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Update Cart Quantity — AC 1: recalculates totals', async () => {
    helper.given_cart_state({
      items: [{ sku: 'PET-HAR-001', name: 'Premium Dog Harness', price: '£34.99', quantity: 2, lineTotal: 69.98 }],
      itemCount: 2,
      subtotal: 69.98,
      subtotalFormatted: '£69.98',
    });
    await helper.when_customer_views_shopping_cart();
    await helper.when_customer_changes_quantity('PET-HAR-001', '3');
    helper.then_cart_subtotal_displayed('104.97');
  });

  it('Update Cart Quantity — AC 2: zero removes line', async () => {
    helper.given_cart_state({
      items: [{ sku: 'PET-TRT-042', name: 'Salmon Cat Treats', price: '£4.99', quantity: 1, lineTotal: 4.99 }],
      itemCount: 1,
      subtotal: 4.99,
      subtotalFormatted: '£4.99',
    });
    await helper.when_customer_views_shopping_cart();
    await helper.when_customer_changes_quantity('PET-TRT-042', '0');
    helper.then_empty_cart_message();
  });

  it('Update Cart Quantity — AC 3: rejects invalid quantity', async () => {
    helper.given_cart_state({
      items: [{ sku: 'PET-HAR-001', name: 'Premium Dog Harness', price: '£34.99', quantity: 2, lineTotal: 69.98 }],
      itemCount: 2,
      subtotal: 69.98,
      subtotalFormatted: '£69.98',
    });
    await helper.when_customer_views_shopping_cart();
    await helper.when_customer_changes_quantity('PET-HAR-001', '-1');
    helper.then_validation_error(/quantity must be a whole number zero or greater/i);
  });
});
