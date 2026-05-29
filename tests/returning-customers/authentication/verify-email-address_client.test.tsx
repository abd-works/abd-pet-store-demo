import '../setup.client-mocks';
/**
 * Verify Email Address — client tests (Increment 4)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { ReturningCustomersClientHelper } from '../helpers/returning-customers.client';

describe('Verify Email Address', () => {
  const helper = new ReturningCustomersClientHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Verify Email Address — AC 1: valid link verifies account', async () => {
    await helper.when_customer_views_verify_email_success();
    expect(screen.getByRole('link', { name: /log in/i })).toBeInTheDocument();
  });

  it('Verify Email Address — AC 2: used link idempotent message', async () => {
    await helper.when_customer_views_verify_email_success();
    expect(screen.getByText(/you're verified/i)).toBeInTheDocument();
  });

  it('Verify Email Address — AC 3: expired link resend action', async () => {
    await helper.when_customer_views_verify_email_expired();
    helper.then_resend_verification_visible();
  });
});
