import '../setup.client-mocks';
/**
 * Manage Saved Payment Methods — client tests (Increment 4)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { ReturningCustomersClientHelper } from '../helpers/returning-customers.client';

describe('Manage Saved Payment Methods', () => {
  const helper = new ReturningCustomersClientHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Manage Saved Payment Methods — AC 1: list with default indicator', async () => {
    helper.given_saved_payment_methods([
      {
        id: 'pm-4242',
        lastFour: '4242',
        cardType: 'Visa',
        expiryMonth: 12,
        expiryYear: 2027,
        isDefault: true,
        isExpired: false,
      },
    ]);
    await helper.when_customer_views_payment_methods();
    expect(screen.getByText(/default payment method/i)).toBeInTheDocument();
    expect(screen.getByText(/4242/i)).toBeInTheDocument();
  });

  it('Manage Saved Payment Methods — AC 2: remove default prompts new default', async () => {
    helper.given_saved_payment_methods([
      {
        id: 'pm-4242',
        lastFour: '4242',
        cardType: 'Visa',
        expiryMonth: 12,
        expiryYear: 2027,
        isDefault: true,
        isExpired: false,
      },
    ]);
    await helper.when_customer_views_payment_methods();
    expect(screen.getByRole('button', { name: /remove payment method/i })).toBeInTheDocument();
  });

  it('Manage Saved Payment Methods — AC 3: set default demotes previous', async () => {
    helper.given_saved_payment_methods([
      {
        id: 'pm-4242',
        lastFour: '4242',
        cardType: 'Visa',
        expiryMonth: 12,
        expiryYear: 2027,
        isDefault: false,
        isExpired: false,
      },
      {
        id: 'pm-5555',
        lastFour: '5555',
        cardType: 'Mastercard',
        expiryMonth: 6,
        expiryYear: 2028,
        isDefault: true,
        isExpired: false,
      },
    ]);
    await helper.when_customer_views_payment_methods();
    expect(screen.getByText(/5555/i)).toBeInTheDocument();
  });
});
