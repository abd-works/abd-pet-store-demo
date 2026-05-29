/**
 * Remove Product from Cart — client tests (Increment 2)
 */
import { describe, it, beforeEach, afterEach } from 'vitest';
import { ClickAndCollectClientHelper } from '../helpers/click-and-collect.client';

describe('Remove Product from Cart', () => {
  const helper = new ClickAndCollectClientHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Remove Product from Cart — AC 1: removes item', async () => {
    helper.given_cart_state({
      items: [
        { sku: 'PET-HAR-001', name: 'Premium Dog Harness', price: '£34.99', quantity: 1, lineTotal: 34.99 },
        { sku: 'PET-TRT-042', name: 'Salmon Cat Treats', price: '£4.99', quantity: 2, lineTotal: 9.98 },
      ],
      itemCount: 3,
      subtotal: 44.97,
      subtotalFormatted: '£44.97',
    });
    await helper.when_customer_views_shopping_cart();
    await helper.when_customer_removes_item('PET-HAR-001');
    helper.then_cart_subtotal_displayed('9.98');
  });

  it('Remove Product from Cart — AC 2: empty state blocks checkout', async () => {
    helper.given_cart_state({
      items: [{ sku: 'PET-TRT-042', name: 'Salmon Cat Treats', price: '£4.99', quantity: 1, lineTotal: 4.99 }],
      itemCount: 1,
      subtotal: 4.99,
      subtotalFormatted: '£4.99',
    });
    await helper.when_customer_views_shopping_cart();
    await helper.when_customer_removes_item('PET-TRT-042');
    helper.then_empty_cart_message();
    helper.then_checkout_unavailable();
  });

  it('Remove Product from Cart — AC 3: continue shopping link', async () => {
    helper.given_cart_state({ items: [], itemCount: 0, subtotal: 0, subtotalFormatted: '£0.00' });
    await helper.when_customer_views_shopping_cart();
    helper.then_continue_shopping_link();
  });
});
