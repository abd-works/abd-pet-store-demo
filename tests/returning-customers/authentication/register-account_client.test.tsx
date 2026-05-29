import '../setup.client-mocks';
/**
 * Register Account — client tests (Increment 4)
 */
import { describe, it, beforeEach, afterEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import * as authApi from '@pawplace/customer-account-client/auth.api';
import { ReturningCustomersClientHelper } from '../helpers/returning-customers.client';
import { ReturningCustomersBase } from '../helpers/returning-customers.base';

describe('Register Account', () => {
  const helper = new ReturningCustomersClientHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Register Account — AC 1: form collects credentials with requirements visible', async () => {
    await helper.when_customer_views_register_page();
    helper.then_password_requirements_visible();
  });

  it('Register Account — AC 2: creates unverified account and confirmation', async () => {
    await helper.when_customer_views_register_page();
    await helper.when_customer_submits_registration();
    expect(await screen.findByText(/check your email/i)).toBeInTheDocument();
  });

  it('Register Account — AC 3: duplicate email enumeration-safe error', async () => {
    vi.mocked(authApi.registerAccount).mockRejectedValueOnce(
      Object.assign(new Error('This email is already in use'), {
        body: { error: 'This email is already in use', loginUrl: '/login' },
      }),
    );
    await helper.when_customer_views_register_page();
    await helper.when_customer_submits_registration();
    helper.then_duplicate_email_error();
  });

  it('Register Account — AC 4: password requirements block creation', async () => {
    vi.mocked(authApi.registerAccount).mockRejectedValueOnce(
      Object.assign(new Error('minimum 8 characters'), { body: { error: 'minimum 8 characters' } }),
    );
    await helper.when_customer_views_register_page();
    await helper.when_customer_submits_registration({
      ...ReturningCustomersBase.NEW_USER,
      password: 'short',
    });
    expect(await screen.findByRole('alert')).toHaveTextContent(/minimum 8 characters/i);
  });
});
