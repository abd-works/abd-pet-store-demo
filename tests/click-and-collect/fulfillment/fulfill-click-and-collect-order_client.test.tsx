/**
 * Fulfill Click-and-Collect Order — client tests (Increment 2)
 */
import { describe, it, beforeEach, afterEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { expect } from 'vitest';
import * as orderApi from '@pawplace/order-client/order.api';
import { ClickAndCollectClientHelper } from '../helpers/click-and-collect.client';
import { ClickAndCollectBase } from '../helpers/click-and-collect.base';

vi.mock('@pawplace/order-client/order.api');

describe('Fulfill Click-and-Collect Order', () => {
  const helper = new ClickAndCollectClientHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Fulfill Click-and-Collect Order — AC 2: uncollected remains visible', async () => {
    await helper.when_staff_views_order_detail('ORD-2001', 'ready_for_pickup');
    helper.then_labeled_paragraph(/guest email:/i, ClickAndCollectBase.VALID_GUEST.guest_email);
    expect(screen.getByText(/ready for pickup|ready_for_pickup/i)).toBeInTheDocument();
  });

  it('Fulfill Click-and-Collect Order — AC 3: queue empty state', async () => {
    vi.mocked(orderApi.fetchClickAndCollectQueue).mockResolvedValue([]);
    await helper.when_staff_views_empty_queue();
    helper.then_queue_empty_state();
  });
});
