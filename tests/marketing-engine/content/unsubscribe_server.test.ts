/**
 * Marketing unsubscribe — server tests (Increment 8 Sprint 4)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import request from 'supertest';
import { app, testDeps } from '@pawplace/app-server';
import { UnsubscribeToken } from '../../../packages/marketing/shared/UnsubscribeToken';
import { ReturningCustomersServerHelper } from '../../returning-customers/helpers/returning-customers.server';

describe('Unsubscribe from Marketing Emails', () => {
  const helper = new ReturningCustomersServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('email link immediately opts out and is idempotent', async () => {
    const accountAgent = helper.createSessionAgent();
    await helper.given_logged_in_verified(accountAgent);
    const accountId = (await accountAgent.get('/api/account')).body.id as string;

    await accountAgent
      .patch('/api/account/communication-preferences')
      .send({ category: 'promotions', optedIn: true });

    const token = UnsubscribeToken.sign(accountId, 'promotions');
    const first = await request(app).get(`/api/marketing/unsubscribe/${token}`);
    expect(first.status).toBe(200);
    expect(first.body.category).toBe('promotions');

    const canSend = await testDeps.marketingConsentGuard.canSend(accountId, 'promotions');
    expect(canSend).toBe(false);

    const second = await request(app).get(`/api/marketing/unsubscribe/${token}`);
    expect(second.status).toBe(200);
  });

  it('rejects invalid tokens safely', async () => {
    const result = await request(app).get('/api/marketing/unsubscribe/not-a-valid-token');
    expect(result.status).toBe(400);
  });
});
