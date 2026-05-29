import '../setup.client-mocks';
/**
 * Save Delivery Address — client tests (Increment 4)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReturningCustomersClientHelper } from '../helpers/returning-customers.client';
import { ReturningCustomersBase } from '../helpers/returning-customers.base';

describe('Save Delivery Address', () => {
  const helper = new ReturningCustomersClientHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Save Delivery Address — AC 1: checkout save opt-in', async () => {
    await helper.when_customer_views_logged_in_shipping();
    expect(screen.getByLabelText(/save this address for future orders/i)).toBeInTheDocument();
  });

  it('Save Delivery Address — AC 2: first address auto-default', async () => {
    await helper.when_customer_views_address_book();
    await userEvent.click(screen.getByRole('button', { name: /add address/i }));
    await userEvent.type(screen.getByLabelText(/address line 1/i), ReturningCustomersBase.HOME_ADDRESS.addressLine1);
    await userEvent.type(screen.getByLabelText(/city/i), ReturningCustomersBase.HOME_ADDRESS.city);
    await userEvent.type(screen.getByLabelText(/postcode/i), ReturningCustomersBase.HOME_ADDRESS.postcode);
    await userEvent.click(screen.getByRole('button', { name: /save address/i }));
    helper.then_default_address_indicator();
  });

  it('Save Delivery Address — AC 3: additional entry non-destructive', async () => {
    helper.given_saved_addresses([
      {
        id: 'addr-1',
        recipientName: 'Jane Doe',
        label: 'Home',
        addressLine1: ReturningCustomersBase.HOME_ADDRESS.addressLine1,
        addressLine2: '',
        city: ReturningCustomersBase.HOME_ADDRESS.city,
        countyOrRegion: '',
        postcode: ReturningCustomersBase.HOME_ADDRESS.postcode,
        country: ReturningCustomersBase.HOME_ADDRESS.country,
        isDefault: true,
      },
    ]);
    await helper.when_customer_views_address_book();
    helper.then_address_listed(ReturningCustomersBase.HOME_ADDRESS);
    expect(screen.getByRole('button', { name: /add address/i })).toBeInTheDocument();
  });
});
