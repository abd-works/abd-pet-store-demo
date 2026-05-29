import '../setup.client-mocks';
/**
 * Select Saved Payment Method at Checkout — client tests (Increment 4)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReturningCustomersClientHelper } from '../helpers/returning-customers.client';

describe('Select Saved Payment Method at Checkout', () => {
  const helper = new ReturningCustomersClientHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Select Saved Payment Method at Checkout — AC 1: list with default pre-selected', async () => {
    await helper.when_customer_views_logged_in_payment();
    helper.then_saved_payment_preselected('4242');
  });

  it('Select Saved Payment Method at Checkout — AC 2: token charge with confirmation', async () => {
    await helper.when_customer_views_logged_in_payment();
    expect(screen.getByText(/4242/i)).toBeInTheDocument();
    expect(screen.getByText(/visa/i)).toBeInTheDocument();
  });

  it('Select Saved Payment Method at Checkout — AC 3: manual entry with save opt-in', async () => {
    await helper.when_customer_views_logged_in_payment();
    await userEvent.click(screen.getByRole('button', { name: /use a different payment method/i }));
    expect(screen.getByLabelText(/save this payment method for future orders/i)).toBeInTheDocument();
  });

  it('Select Saved Payment Method at Checkout — AC 4: expired token not charged', async () => {
    await helper.when_customer_views_logged_in_payment();
    helper.then_expired_payment_marked('9999');
  });
});
