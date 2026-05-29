/**
 * Select Delivery Option — client tests (Increment 3)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { screen, within, waitFor } from '@testing-library/react';
import { ShipToHomeClientHelper } from '../helpers/ship-to-home.client';

describe('Select Delivery Option', () => {
  const helper = new ShipToHomeClientHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Select Delivery Option — AC 1: both options with cost and window', async () => {
    await helper.when_customer_views_delivery_option();
    helper.then_delivery_options_visible();
    expect(screen.getAllByText(/3–5 business days/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/£4\.99/i).length).toBeGreaterThan(0);
  });

  it('Select Delivery Option — AC 3: switch adjusts steps billing always required', async () => {
    await helper.when_customer_views_delivery_option();
    await helper.when_customer_selects_delivery_option('click_and_collect');
    helper.then_pickup_store_list_visible();
    await helper.when_customer_selects_delivery_option('standard_delivery');
    expect(screen.getByRole('button', { name: /continue to billing address/i })).toBeInTheDocument();
  });

  it('Select Delivery Option — AC 4: deferred options hidden extensible layout', async () => {
    await helper.when_customer_views_delivery_option();
    helper.then_delivery_options_visible();
    expect(screen.getByRole('group', { name: /delivery option/i })).toBeInTheDocument();
  });

  it('Select Delivery Option — AC 2: standard confirms address and cost', async () => {
    await helper.when_customer_views_delivery_option();
    expect(screen.getAllByText(/28 Oak Lane/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/£4\.99/i).length).toBeGreaterThan(0);
    await helper.when_customer_confirms_delivery_option();
    await waitFor(() => expect(screen.getByRole('heading', { name: /payment/i })).toBeInTheDocument());
  });
});
