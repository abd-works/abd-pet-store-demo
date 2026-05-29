/**
 * Check Out as Guest — client tests (Increment 2)
 */
import { describe, it, beforeEach, afterEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'vitest';
import * as orderApi from '@pawplace/order-client/order.api';
import { ClickAndCollectClientHelper } from '../helpers/click-and-collect.client';
import { ClickAndCollectBase } from '../helpers/click-and-collect.base';

vi.mock('@pawplace/order-client/order.api');

describe('Check Out as Guest', () => {
  const helper = new ClickAndCollectClientHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Check Out as Guest — AC 1: guest default no account path', async () => {
    await helper.when_customer_views_guest_billing();
    helper.then_guest_checkout_default();
    expect(screen.getByLabelText(/guest email/i)).toBeInTheDocument();
  });

  it('Check Out as Guest — AC 3: invalid email blocked', async () => {
    await helper.when_customer_views_guest_billing();
    await helper.when_customer_fills_billing(
      ClickAndCollectBase.VALID_BILLING,
      ClickAndCollectBase.INVALID_GUEST_EMAIL,
      'Tom Brown',
    );
    await helper.when_customer_submits_billing();
    helper.then_validation_error(/invalid guest email/i);
  });

  it('Check Out as Guest — AC 4: dismissible account prompt', async () => {
    await helper.when_customer_views_order_confirmation('ORD-2001');
    helper.then_account_prompt_visible();
    await userEvent.click(screen.getByRole('button', { name: /dismiss/i }));
    expect(screen.queryByText(/create a customer account/i)).not.toBeInTheDocument();
  });
});
