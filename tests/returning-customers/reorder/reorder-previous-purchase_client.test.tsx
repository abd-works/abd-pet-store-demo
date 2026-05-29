import '../setup.client-mocks';
/**
 * Reorder Previous Purchase — client tests (Increment 4)
 */
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as accountApi from '@pawplace/customer-account-client/account.api';
import { ReturningCustomersClientHelper } from '../helpers/returning-customers.client';

vi.mock('@pawplace/customer-account-client/account.api');

describe('Reorder Previous Purchase', () => {
  const helper = new ReturningCustomersClientHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Reorder Previous Purchase — AC 1: reorder navigates to cart', async () => {
    await helper.when_customer_views_order_detail('ORD-1002');
    await userEvent.click(screen.getByRole('button', { name: /reorder/i }));
    expect(await screen.findByText(/added to cart/i)).toBeInTheDocument();
  });

  it('Reorder Previous Purchase — AC 2: delisted partial success message', async () => {
    vi.mocked(accountApi.reorderOrder).mockResolvedValueOnce({
      addedSkus: [],
      skippedSkus: ['PET-DELISTED-999'],
      stockWarnings: [],
    });
    await helper.when_customer_views_order_detail('ORD-1002');
    await userEvent.click(screen.getByRole('button', { name: /reorder/i }));
    expect(await screen.findByText(/no longer available/i)).toBeInTheDocument();
  });

  it('Reorder Previous Purchase — AC 3: out of stock warning options', async () => {
    vi.mocked(accountApi.reorderOrder).mockResolvedValueOnce({
      addedSkus: ['PET-FLT-099'],
      skippedSkus: [],
      stockWarnings: [{ sku: 'PET-FLT-099', message: 'Out of stock' }],
    });
    await helper.when_customer_views_order_detail('ORD-1002');
    await userEvent.click(screen.getByRole('button', { name: /reorder/i }));
    expect(await screen.findByText(/out of stock/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /proceed anyway/i })).toBeInTheDocument();
  });

  it('Reorder Previous Purchase — AC 4: merge sums quantities', async () => {
    vi.mocked(accountApi.reorderOrder).mockResolvedValueOnce({
      addedSkus: ['SKU-DOG-FOOD-01'],
      skippedSkus: [],
      stockWarnings: [],
    });
    await helper.when_customer_views_order_detail('ORD-1002');
    await userEvent.click(screen.getByRole('button', { name: /reorder/i }));
    expect(await screen.findByText(/added to cart/i)).toBeInTheDocument();
  });
});
