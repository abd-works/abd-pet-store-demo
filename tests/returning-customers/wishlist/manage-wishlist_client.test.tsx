import '../setup.client-mocks';
/**
 * Manage Wishlist — client tests (Increment 4)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReturningCustomersClientHelper } from '../helpers/returning-customers.client';
import { ReturningCustomersBase } from '../helpers/returning-customers.base';

describe('Manage Wishlist', () => {
  const helper = new ReturningCustomersClientHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Manage Wishlist — AC 1: add toggles control state', async () => {
    helper.given_verified_session();
    await helper.when_customer_views_product_wishlist_button(ReturningCustomersBase.SKU_DOG_FOOD);
    await userEvent.click(screen.getByRole('button', { name: /add to wishlist/i }));
    expect(await screen.findByRole('button', { name: /remove from wishlist/i })).toBeInTheDocument();
  });

  it('Manage Wishlist — AC 2: list with stock availability', async () => {
    helper.given_wishlist_items([
      {
        sku: ReturningCustomersBase.SKU_DOG_FOOD,
        productName: 'Premium Dog Kibble 5kg',
        price: '£29.99',
        stockAvailability: 'In stock',
      },
      {
        sku: ReturningCustomersBase.SKU_CAT_TOY,
        productName: 'Feather Wand Cat Toy',
        price: '£7.50',
        stockAvailability: 'Out of stock',
      },
    ]);
    await helper.when_customer_views_wishlist();
    helper.then_wishlist_stock_label('Premium Dog Kibble 5kg', /in stock/i);
    helper.then_wishlist_stock_label('Feather Wand Cat Toy', /out of stock/i);
  });

  it('Manage Wishlist — AC 3: add to cart retains wishlist item', async () => {
    helper.given_wishlist_items([
      {
        sku: ReturningCustomersBase.SKU_DOG_FOOD,
        productName: 'Premium Dog Kibble 5kg',
        price: '£29.99',
        stockAvailability: 'In stock',
      },
    ]);
    await helper.when_customer_views_wishlist();
    await userEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(screen.getByRole('button', { name: /remove from wishlist/i })).toBeInTheDocument();
  });

  it('Manage Wishlist — AC 4: remove resets product control', async () => {
    helper.given_wishlist_items([
      {
        sku: ReturningCustomersBase.SKU_DOG_FOOD,
        productName: 'Premium Dog Kibble 5kg',
        price: '£29.99',
        stockAvailability: 'In stock',
      },
    ]);
    await helper.when_customer_views_wishlist();
    await userEvent.click(screen.getByRole('button', { name: /remove from wishlist/i }));
    expect(screen.queryByText(/Premium Dog Kibble/i)).not.toBeInTheDocument();
  });

  it('Manage Wishlist — AC 5: guest dismissible prompt', async () => {
    helper.given_guest_session();
    await helper.when_customer_views_product_wishlist_button(ReturningCustomersBase.SKU_DOG_FOOD);
    await userEvent.click(screen.getByRole('button', { name: /add to wishlist/i }));
    helper.then_guest_wishlist_prompt();
    await userEvent.click(screen.getByRole('button', { name: /dismiss/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
