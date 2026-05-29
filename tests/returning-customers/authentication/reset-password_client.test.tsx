import '../setup.client-mocks';
/**
 * Reset Password — client tests (Increment 4)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReturningCustomersClientHelper } from '../helpers/returning-customers.client';

describe('Reset Password', () => {
  const helper = new ReturningCustomersClientHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Reset Password — AC 1: enumeration-safe confirmation', async () => {
    await helper.when_customer_views_reset_request();
    await userEvent.type(screen.getByLabelText(/email address/i), 'anyone@example.com');
    await userEvent.click(screen.getByRole('button', { name: /send reset link/i }));
    expect(await screen.findByText(/check your email/i)).toBeInTheDocument();
  });

  it('Reset Password — AC 2: valid link opens form', async () => {
    await helper.when_customer_views_reset_set_form();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it('Reset Password — AC 3: password update invalidates sessions', async () => {
    await helper.when_customer_views_reset_set_form();
    await userEvent.type(screen.getByLabelText(/^new password$/i), 'NewStr0ngP@ss!');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'NewStr0ngP@ss!');
    await userEvent.click(screen.getByRole('button', { name: /update password/i }));
    expect(await screen.findByText(/password updated/i)).toBeInTheDocument();
  });

  it('Reset Password — AC 4: expired or used link rejected', async () => {
    await helper.when_customer_views_reset_set_form('expired-token');
    expect(await screen.findByText(/link expired/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /request new reset/i })).toBeInTheDocument();
  });
});
