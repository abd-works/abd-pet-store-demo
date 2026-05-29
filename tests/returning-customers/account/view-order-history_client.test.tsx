import '../setup.client-mocks';
/**
 * View Order History — client tests (Increment 4)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReturningCustomersClientHelper } from '../helpers/returning-customers.client';

describe('View Order History', () => {
  const helper = new ReturningCustomersClientHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('View Order History — AC 1: list most recent first', async () => {
    helper.given_order_history([
      {
        orderNumber: 'ORD-1002',
        placedAt: '2026-05-01T10:00:00Z',
        itemSummary: 'Feather Wand Cat Toy × 3',
        totalFormatted: '£82.50',
        statusLabel: 'Shipped',
      },
      {
        orderNumber: 'ORD-1001',
        placedAt: '2026-04-15T09:00:00Z',
        itemSummary: 'Premium Dog Harness × 1',
        totalFormatted: '£34.99',
        statusLabel: 'Delivered',
      },
    ]);
    await helper.when_customer_views_order_history();
    const rows = screen.getAllByRole('listitem');
    expect(rows[0]).toHaveTextContent('ORD-1002');
  });

  it('View Order History — AC 2: full order detail', async () => {
    await helper.when_customer_views_order_detail('ORD-1002');
    expect(screen.getByLabelText(/order line item list/i)).toBeInTheDocument();
    expect(screen.getByText(/RM-1Z999AA10123456784/i)).toBeInTheDocument();
  });

  it('View Order History — AC 3: empty state', async () => {
    await helper.when_customer_views_order_history();
    helper.then_empty_order_history_prompt();
  });

  it('View Order History — AC 4: guest order retroactive association', async () => {
    helper.given_order_history([
      {
        orderNumber: 'ORD-3001',
        placedAt: '2026-05-10T12:00:00Z',
        itemSummary: 'Guest order item',
        totalFormatted: '£29.99',
        statusLabel: 'Confirmed',
      },
    ]);
    await helper.when_customer_views_order_history();
    expect(screen.getByText(/ORD-3001/i)).toBeInTheDocument();
  });
});
