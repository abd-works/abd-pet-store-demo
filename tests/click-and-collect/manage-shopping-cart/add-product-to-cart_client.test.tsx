/**
 * Add Product to Cart — client tests (Increment 2)
 */
import { describe, it, beforeEach, afterEach } from 'vitest';
import { ClickAndCollectClientHelper } from '../helpers/click-and-collect.client';

describe('Add Product to Cart', () => {
  const helper = new ClickAndCollectClientHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Add Product to Cart — AC 1: adds item and updates count', async () => {
    await helper.when_customer_views_product_page('PET-HAR-001', true);
    await helper.when_customer_clicks_add_to_cart();
    helper.then_cart_badge_shows(1);
  });

  it('Add Product to Cart — AC 3: blocks out of stock', async () => {
    await helper.when_customer_views_product_page('PET-FLT-099', false);
    helper.then_add_to_cart_disabled();
    helper.then_out_of_stock_message();
  });
});
