/**
 * Enter Billing Address — client tests (Increment 2)
 */
import { describe, it, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import { expect } from 'vitest';
import { ClickAndCollectClientHelper } from '../helpers/click-and-collect.client';

describe('Enter Billing Address', () => {
  const helper = new ClickAndCollectClientHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Enter Billing Address — AC 1: collects required fields', async () => {
    await helper.when_customer_views_guest_billing();
    expect(screen.getByLabelText(/addressLine1/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/postcode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
  });

  it('Enter Billing Address — AC 2: missing fields blocked', async () => {
    await helper.when_customer_views_guest_billing();
    await helper.when_customer_submits_billing();
    helper.then_validation_error(/address line 1 is required/i);
  });

  it('Enter Billing Address — AC 3: advances with summary preview', async () => {
    await helper.when_customer_views_guest_billing();
    expect(screen.getByLabelText(/order summary/i)).toBeInTheDocument();
    const summary = screen.getByLabelText(/order summary/i);
    helper.then_labeled_paragraph(/pickup store:/i, 'PawPlace Camden', summary);
  });
});
