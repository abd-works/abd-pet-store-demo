import type { AccountDashboardDto, RegisterInput, LoginInput } from '@pawplace/customer-account-shared';
import { accountDashboardSchema } from '@pawplace/customer-account-shared';
import { performFetch } from '../../shared/http-io';
import { assertResponseOk } from '../../shared/http-client';

export async function registerAccount(input: RegisterInput): Promise<{ message: string }> {
  const response = await performFetch('/api/auth/register', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw Object.assign(new Error(body.error ?? 'Registration failed'), { status: response.status, body });
  }
  return response.json();
}

export async function loginAccount(input: LoginInput): Promise<AccountDashboardDto> {
  const response = await performFetch('/api/auth/login', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw Object.assign(new Error(body.error ?? 'Login failed'), { status: response.status, body });
  }
  const raw = await response.json();
  return accountDashboardSchema.parse(raw);
}

export async function fetchCurrentAccount(): Promise<AccountDashboardDto | null> {
  const response = await performFetch('/api/account', { credentials: 'include' });
  if (response.status === 401) return null;
  assertResponseOk(response, 'account');
  return accountDashboardSchema.parse(await response.json());
}

export async function logoutAccount(): Promise<void> {
  await performFetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
}

export async function logoutEverywhere(): Promise<void> {
  await performFetch('/api/auth/logout-everywhere', { method: 'POST', credentials: 'include' });
}

export async function verifyEmailToken(token: string): Promise<{ outcome?: string; error?: string; code?: string }> {
  const response = await performFetch(`/api/auth/verify?token=${encodeURIComponent(token)}`, {
    credentials: 'include',
  });
  return response.json();
}

export async function resendVerification(email: string): Promise<void> {
  await performFetch('/api/auth/resend-verification', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
}

export async function requestPasswordReset(email: string): Promise<void> {
  await performFetch('/api/auth/password-reset/request', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
}

export async function confirmPasswordReset(token: string, password: string, passwordConfirmation: string): Promise<void> {
  const response = await performFetch('/api/auth/password-reset/confirm', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password, passwordConfirmation }),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw Object.assign(new Error(body.error ?? 'Reset failed'), { status: response.status, body });
  }
}

export async function validateResetToken(token: string): Promise<boolean> {
  const response = await performFetch(`/api/auth/password-reset/validate?token=${encodeURIComponent(token)}`, {
    credentials: 'include',
  });
  const body = await response.json();
  return Boolean(body.valid);
}
