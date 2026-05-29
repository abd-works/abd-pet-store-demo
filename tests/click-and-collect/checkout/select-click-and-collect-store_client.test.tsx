/**
 * Select Click-and-Collect Store — client tests (Increment 2)
 */
import { describe, it, beforeEach, afterEach } from 'vitest';
import { screen, within } from '@testing-library/react';
import { expect } from 'vitest';
import { ClickAndCollectClientHelper } from '../helpers/click-and-collect.client';

describe('Select Click-and-Collect Store', () => {
  const helper = new ClickAndCollectClientHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Select Click-and-Collect Store — AC 1: sole delivery option and store list', async () => {
    await helper.when_customer_views_pickup_store_selection();
    helper.then_click_and_collect_only();
    helper.then_pickup_store_list_count(2);
    expect(screen.getByText(/PawPlace Camden/i)).toBeInTheDocument();
    expect(screen.getByText(/PawPlace Bristol/i)).toBeInTheDocument();
  });

  it('Select Click-and-Collect Store — AC 2: records pickup store', async () => {
    await helper.when_customer_views_pickup_store_selection();
    await helper.when_customer_selects_pickup_store('PawPlace Camden');
    const summary = screen.getByLabelText(/checkout summary/i);
    helper.then_labeled_paragraph(/pickup store name:/i, 'PawPlace Camden', summary);
    helper.then_labeled_paragraph(/pickup store address:/i, '42 High Street', summary);
  });

  it('Select Click-and-Collect Store — AC 3: lists all stores without location', async () => {
    await helper.when_customer_views_pickup_store_selection();
    helper.then_pickup_store_list_count(2);
    expect(screen.queryByText(/distance:/i)).not.toBeInTheDocument();
  });

  it('Select Click-and-Collect Store — AC 4: summary shows pickup store', async () => {
    await helper.when_customer_views_pickup_store_selection();
    await helper.when_customer_selects_pickup_store('PawPlace Camden');
    const summary = screen.getByLabelText(/checkout summary/i);
    helper.then_labeled_paragraph(/pickup store name:/i, 'PawPlace Camden', summary);
    helper.then_labeled_paragraph(/pickup store address:/i, 'London', summary);
  });
});
