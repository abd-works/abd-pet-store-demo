import '../setup.client-mocks';
/**
 * Save Payment Method — client tests (Increment 4)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { ReturningCustomersClientHelper } from '../helpers/returning-customers.client';

describe('Save Payment Method', () => {
  const helper = new ReturningCustomersClientHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Save Payment Method — AC 1: checkout save via token', async () => {
    await helper.when_customer_views_logged_in_payment();
    expect(screen.getByLabelText(/save this payment method for future orders/i)).toBeInTheDocument();
  });

  it('Save Payment Method — AC 2: display metadata without raw card', async () => {
    await helper.when_customer_views_logged_in_payment();
    expect(screen.getByText(/4242/i)).toBeInTheDocument();
    expect(screen.queryByText(/4242424242424242/)).not.toBeInTheDocument();
  });

  it('Save Payment Method — AC 3: second method retains first default', async () => {
    await helper.when_customer_views_logged_in_payment();
    helper.then_saved_payment_preselected('4242');
  });
});
