/**
 * Select Payment Method — client tests (Increment 2)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { ClickAndCollectClientHelper } from '../helpers/click-and-collect.client';

describe('Select Payment Method', () => {
  const helper = new ClickAndCollectClientHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Select Payment Method — AC 1: StripeWave sole vendor', async () => {
    await helper.when_customer_views_payment_page('ORD-2001');
    helper.then_stripewave_sole_vendor();
    expect(screen.getByLabelText(/card number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/expiry/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cvv/i)).toBeInTheDocument();
  });

  it('Select Payment Method — AC 2: valid card advances', async () => {
    await helper.when_customer_views_payment_page('ORD-2001');
    await helper.when_customer_enters_card('4242424242424242', '12/27', '123');
    expect(screen.getByRole('button', { name: /confirm order/i })).not.toBeDisabled();
  });

  it('Select Payment Method — AC 3: invalid card blocked', async () => {
    await helper.when_customer_views_payment_page('ORD-2001');
    await helper.when_customer_enters_card('1234', '01/22', '');
    await helper.when_customer_confirms_payment();
    helper.then_validation_error(/invalid/i);
  });
});
