/**
 * Confirm Order and Send Confirmation Email — client tests (Increment 2)
 */
import { describe, it, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import { expect } from 'vitest';
import { ClickAndCollectClientHelper } from '../helpers/click-and-collect.client';
import { ClickAndCollectBase } from '../helpers/click-and-collect.base';

describe('Confirm Order and Send Confirmation Email', () => {
  const helper = new ClickAndCollectClientHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Confirm Order and Send Confirmation Email — AC 1: confirmation page and email', async () => {
    await helper.when_customer_views_order_confirmation('ORD-2001');
    helper.then_labeled_paragraph(/order number:/i, 'ORD-2001');
    expect(screen.getByText(/total paid:/i)).toBeInTheDocument();
    helper.then_labeled_paragraph(/pickup store address:/i, '42 High Street');
    expect(screen.getByRole('status')).toHaveTextContent(ClickAndCollectBase.VALID_GUEST.guest_email);
  });

  it('Confirm Order and Send Confirmation Email — AC 2: email content', async () => {
    await helper.when_customer_views_order_confirmation('ORD-2001');
    helper.then_labeled_paragraph(/masked payment method:/i, 'StripeWave');
    expect(screen.getByText(/operating hours/i)).toBeInTheDocument();
  });

  it('Confirm Order and Send Confirmation Email — AC 3: email failure non-blocking', async () => {
    await helper.when_customer_views_order_confirmation('ORD-2001', 'queued');
    expect(screen.getByTestId('order-confirmation')).toBeInTheDocument();
    expect(screen.getByText(/confirmation email queued for retry/i)).toBeInTheDocument();
  });
});
