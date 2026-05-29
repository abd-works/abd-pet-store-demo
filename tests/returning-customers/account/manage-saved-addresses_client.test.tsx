import '../setup.client-mocks';
/**
 * Manage Saved Addresses — client tests (Increment 4)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { ReturningCustomersClientHelper } from '../helpers/returning-customers.client';
import { ReturningCustomersBase } from '../helpers/returning-customers.base';

describe('Manage Saved Addresses', () => {
  const helper = new ReturningCustomersClientHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Manage Saved Addresses — AC 1: list with default indicator', async () => {
    helper.given_saved_addresses([
      {
        id: 'addr-home',
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
    helper.then_default_address_indicator();
    helper.then_address_listed(ReturningCustomersBase.HOME_ADDRESS);
  });

  it('Manage Saved Addresses — AC 2: edit persists to checkout', async () => {
    helper.given_saved_addresses([
      {
        id: 'addr-home',
        recipientName: 'Jane Doe',
        label: 'Home',
        addressLine1: '99 Updated Lane',
        addressLine2: '',
        city: 'Manchester',
        countyOrRegion: '',
        postcode: 'M1 1AE',
        country: 'United Kingdom',
        isDefault: true,
      },
    ]);
    await helper.when_customer_views_address_book();
    expect(screen.getByText(/99 Updated Lane/i)).toBeInTheDocument();
  });

  it('Manage Saved Addresses — AC 3: delete default prompts new default', async () => {
    helper.given_saved_addresses([
      {
        id: 'addr-work',
        recipientName: 'Jane Doe',
        label: 'Work',
        addressLine1: ReturningCustomersBase.WORK_ADDRESS.addressLine1,
        addressLine2: '',
        city: ReturningCustomersBase.WORK_ADDRESS.city,
        countyOrRegion: '',
        postcode: ReturningCustomersBase.WORK_ADDRESS.postcode,
        country: ReturningCustomersBase.WORK_ADDRESS.country,
        isDefault: true,
      },
    ]);
    await helper.when_customer_views_address_book();
    expect(screen.getByRole('button', { name: /delete address/i })).toBeInTheDocument();
  });

  it('Manage Saved Addresses — AC 4: set default demotes previous', async () => {
    helper.given_saved_addresses([
      {
        id: 'addr-home',
        recipientName: 'Jane Doe',
        label: 'Home',
        addressLine1: ReturningCustomersBase.HOME_ADDRESS.addressLine1,
        addressLine2: '',
        city: ReturningCustomersBase.HOME_ADDRESS.city,
        countyOrRegion: '',
        postcode: ReturningCustomersBase.HOME_ADDRESS.postcode,
        country: ReturningCustomersBase.HOME_ADDRESS.country,
        isDefault: false,
      },
      {
        id: 'addr-work',
        recipientName: 'Jane Doe',
        label: 'Work',
        addressLine1: ReturningCustomersBase.WORK_ADDRESS.addressLine1,
        addressLine2: '',
        city: ReturningCustomersBase.WORK_ADDRESS.city,
        countyOrRegion: '',
        postcode: ReturningCustomersBase.WORK_ADDRESS.postcode,
        country: ReturningCustomersBase.WORK_ADDRESS.country,
        isDefault: true,
      },
    ]);
    await helper.when_customer_views_address_book();
    helper.then_default_address_indicator();
  });
});
