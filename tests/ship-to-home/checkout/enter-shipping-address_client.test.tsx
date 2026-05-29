/**
 * Enter Shipping Address — client tests (Increment 3)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { cleanup, screen, within } from '@testing-library/react';
import { ShipToHomeClientHelper } from '../helpers/ship-to-home.client';
import { ShipToHomeBase } from '../helpers/ship-to-home.base';

describe('Enter Shipping Address', () => {
  const helper = new ShipToHomeClientHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Enter Shipping Address — AC 1: form on standard path skipped on click-and-collect', async () => {
    await helper.when_customer_views_shipping_address();
    helper.then_shipping_form_fields_present();
    cleanup();
    await helper.when_customer_views_billing_after_click_and_collect();
    helper.then_billing_continue_label(/continue to pickup store/i);
    expect(screen.queryByLabelText(/recipient name/i)).not.toBeInTheDocument();
  });

  it('Enter Shipping Address — AC 2: same as billing pre-fill', async () => {
    await helper.when_customer_views_shipping_address();
    await helper.when_customer_checks_same_as_billing();
    helper.then_shipping_prefilled(ShipToHomeBase.VALID_SHIPPING_FROM_BILLING);
  });

  it('Enter Shipping Address — AC 3: single field override', async () => {
    await helper.when_customer_views_shipping_address();
    await helper.when_customer_checks_same_as_billing();
    await helper.when_customer_overrides_shipping_city('Edinburgh');
    helper.then_shipping_city('Edinburgh');
    helper.then_shipping_address_line_one('10 Elm Avenue');
  });

  it('Enter Shipping Address — AC 4: missing fields blocked', async () => {
    await helper.when_customer_views_shipping_address();
    await helper.when_customer_submits_shipping_address();
    helper.then_shipping_validation_errors([
      /recipient name is required/i,
      /address line 1 is required/i,
      /city is required/i,
      /postcode is required/i,
    ]);
  });

  it('Enter Shipping Address — AC 5: advances with summary preview', async () => {
    await helper.when_customer_views_shipping_address();
    await helper.when_customer_checks_same_as_billing();
    const summary = screen.getByLabelText(/order summary/i);
    expect(within(summary).getByText(/shipping address preview:/i).closest('p')).toHaveTextContent('10 Elm Avenue');
    expect(within(summary).getByText(/billing address preview:/i).closest('p')).toHaveTextContent('London');
  });
});
