import '../setup.client-mocks';
/**
 * Select Saved Address at Checkout — client tests (Increment 4)
 */
import { describe, it, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReturningCustomersClientHelper } from '../helpers/returning-customers.client';

describe('Select Saved Address at Checkout', () => {
  const helper = new ReturningCustomersClientHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Select Saved Address at Checkout — AC 1: list with default pre-selected', async () => {
    await helper.when_customer_views_logged_in_shipping();
    helper.then_saved_address_preselected('Home');
  });

  it('Select Saved Address at Checkout — AC 2: selection auto-fills and advances', async () => {
    await helper.when_customer_views_logged_in_shipping();
    await userEvent.click(screen.getByRole('radio', { name: /work/i }));
    expect(screen.getByDisplayValue(/10 High Street/i)).toBeInTheDocument();
  });

  it('Select Saved Address at Checkout — AC 3: different address with save opt-in', async () => {
    await helper.when_customer_views_logged_in_shipping();
    await userEvent.click(screen.getByRole('button', { name: /use a different address/i }));
    expect(screen.getByLabelText(/save this address for future orders/i)).toBeInTheDocument();
  });

  it('Select Saved Address at Checkout — AC 4: guest manual only preserved', async () => {
    await helper.when_customer_views_guest_shipping();
    helper.then_guest_shipping_prompt();
  });
});
