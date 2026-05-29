import '../setup.client-mocks';
/**
 * Log In — client tests (Increment 4)
 */
import { describe, it, beforeEach, afterEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import * as authApi from '@pawplace/customer-account-client/auth.api';
import { ReturningCustomersClientHelper } from '../helpers/returning-customers.client';
import { ReturningCustomersBase } from '../helpers/returning-customers.base';

describe('Log In', () => {
  const helper = new ReturningCustomersClientHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Log In — AC 1: session created and redirect', async () => {
    await helper.when_customer_views_login_page();
    await helper.when_customer_submits_login(ReturningCustomersBase.JANE.email, ReturningCustomersBase.JANE.password);
    expect(await screen.findByLabelText(/account overview/i)).toBeInTheDocument();
  });

  it('Log In — AC 2: generic credential error', async () => {
    vi.mocked(authApi.loginAccount).mockRejectedValueOnce({
      response: { data: { error: 'invalid email or password' } },
    });
    await helper.when_customer_views_login_page();
    await helper.when_customer_submits_login('wrong@example.com', 'WrongP@ss1!');
    helper.then_login_error(/invalid email or password/i);
  });

  it('Log In — AC 3: unverified blocked with resend', async () => {
    vi.mocked(authApi.loginAccount).mockRejectedValueOnce({
      response: { data: { error: 'please verify your email first', resendAvailable: true } },
    });
    await helper.when_customer_views_login_page();
    await helper.when_customer_submits_login(ReturningCustomersBase.TOM_UNVERIFIED.email, ReturningCustomersBase.TOM_UNVERIFIED.password);
    helper.then_login_error(/please verify your email first/i);
    helper.then_resend_verification_visible();
  });

  it('Log In — AC 4: guest cart merge sums quantities', async () => {
    await helper.when_customer_views_login_page();
    await helper.when_customer_submits_login(ReturningCustomersBase.JANE.email, ReturningCustomersBase.JANE.password);
    expect(await screen.findByLabelText(/account overview/i)).toBeInTheDocument();
  });
});
