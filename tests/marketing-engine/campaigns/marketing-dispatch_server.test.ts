/**
 * Marketing campaigns & alerts — server tests (Increment 8 Sprint 3)
 *
 * File: marketing-dispatch_server.test.ts (area: marketing-engine/campaigns)
 * Stories: Send Promotional Email | Send Personalized Recommendation |
 *          Send Restock Alert | Send In-Store Event Notification
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import type { SuperAgentTest } from 'supertest';
import { testDeps } from '@pawplace/app-server';
import {
  CAMPAIGN_SUBJECT,
  EVENT_TITLE,
  MARIA,
  OPTED_OUT,
  RESTOCK_SKU,
  RESTOCK_PRODUCT_NAME,
  STORE_CAM,
  STORE_CAM_NAME,
  TOM_ACCOUNT,
} from './helpers/campaigns.base';
import { CampaignsServerHelper } from './helpers/campaigns.server';

describe('Send Promotional Email', () => {
  const helper = new CampaignsServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it.each([
    {
      label: 'scenario 1 — opted-in customer receives promotional Notification',
      optedIn: true,
      expectedSent: 1,
      expectedSkipped: 0,
    },
    {
      label: 'scenario 2 — opted-out customer skipped with promotionalOptIn=false',
      optedIn: false,
      expectedSent: 0,
      expectedSkipped: 1,
    },
  ])('$label', async ({ optedIn, expectedSent, expectedSkipped }) => {
    const agent = helper.createSessionAgent();
    const accountId = await helper.given_logged_in_customer(agent, TOM_ACCOUNT);
    await helper.given_communication_opt_in(agent, 'promotions', optedIn);

    const result = await helper.when_admin_sends_promotional_batch({
      ...CampaignsServerHelper.defaultPromotionalBody,
      recipientAccountIds: [accountId],
    });

    expect(result.status).toBe(200);
    helper.then_dispatch_counts(result.body, { sent: expectedSent, skipped: expectedSkipped });
  });

  it('Scenario: Recently opted-out customer re-checked at send time', async () => {
    const agent = helper.createSessionAgent();
    const accountId = await helper.given_logged_in_customer(agent, MARIA);
    await helper.given_communication_opt_in(agent, 'promotions', true);
    await helper.given_communication_opt_in(agent, 'promotions', false);

    const canSend = await testDeps.marketingConsentGuard.canSend(accountId, 'promotions');
    expect(canSend).toBe(false);

    const result = await helper.when_admin_sends_promotional_batch({
      subject: CAMPAIGN_SUBJECT,
      bodyHtml: '<p>Queued batch</p>',
      recipientAccountIds: [accountId],
    });

    expect(result.status).toBe(200);
    helper.then_dispatch_counts(result.body, { sent: 0, skipped: 1 });
  });
});

describe('Send Personalized Recommendation', () => {
  const helper = new CampaignsServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Scenario: Recommendation skipped when no personalization data and not opted in', async () => {
    const agent = helper.createSessionAgent();
    const accountId = await helper.given_logged_in_customer(agent, TOM_ACCOUNT);

    const result = await helper.when_admin_sends_personalized_recommendation(accountId);
    expect(result.status).toBe(200);
    helper.then_dispatch_counts(result.body, { sent: 0, skipped: 1 });
  });

  it('Scenario: Recommendation sent when opted in with wishlist items in stock', async () => {
    const agent = helper.createSessionAgent();
    const accountId = await helper.given_logged_in_customer(agent, TOM_ACCOUNT);
    await helper.given_communication_opt_in(agent, 'recommendations', true);
    await helper.given_wishlist_contains(agent, 'PET-HAR-001');

    const result = await helper.when_admin_sends_personalized_recommendation(accountId);
    expect(result.status).toBe(200);
    helper.then_dispatch_counts(result.body, { sent: 1, skipped: 0 });
  });

  it('Scenario: Recommendation contains only in-stock products', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_logged_in_customer(agent, TOM_ACCOUNT);
    await helper.given_communication_opt_in(agent, 'recommendations', true);
    await helper.given_wishlist_contains(agent, 'PET-HAR-001');

    const inStockOnly = await testDeps.marketingDispatchService.sendPersonalizedRecommendation(
      await helper.resolveAccountId(TOM_ACCOUNT.email),
    );
    expect(inStockOnly.sent + inStockOnly.skipped).toBeGreaterThan(0);
  });
});

describe('Send Restock Alert', () => {
  const helper = new CampaignsServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  async function given_wishlist_opt_in(agent: SuperAgentTest, optedIn: boolean): Promise<string> {
    const accountId = await helper.given_logged_in_customer(agent, TOM_ACCOUNT);
    await helper.given_wishlist_contains(agent, RESTOCK_SKU);
    await helper.given_communication_opt_in(agent, 'restock_alerts', optedIn);
    return accountId;
  }

  it('Scenario 1: RestockAlert Notification sent when wishlist match and restockAlertsOptIn true', async () => {
    const agent = helper.createSessionAgent();
    const accountId = await given_wishlist_opt_in(agent, true);

    const canSend = await testDeps.marketingConsentGuard.canSend(accountId, 'restock_alerts');
    expect(canSend).toBe(true);

    const result = await helper.when_admin_sends_restock_alert(RESTOCK_SKU, RESTOCK_PRODUCT_NAME);
    expect(result.status).toBe(200);
    expect(result.body.sent).toBeGreaterThanOrEqual(1);
  });

  it('Scenario 2: opted-out wishlist customer skipped with restockAlertsOptIn=false', async () => {
    const optedOutAgent = helper.createSessionAgent();
    const accountId = await helper.given_logged_in_customer(optedOutAgent, OPTED_OUT);
    await helper.given_wishlist_contains(optedOutAgent, RESTOCK_SKU);

    const canSend = await testDeps.marketingConsentGuard.canSend(accountId, 'restock_alerts');
    expect(canSend).toBe(false);

    const result = await helper.when_admin_sends_restock_alert(RESTOCK_SKU, RESTOCK_PRODUCT_NAME);
    expect(result.status).toBe(200);
    expect(result.body.skipped).toBeGreaterThanOrEqual(1);
  });

  it('Scenario: consent guard blocks restock alert after realtime opt-out', async () => {
    const agent = helper.createSessionAgent();
    const accountId = await given_wishlist_opt_in(agent, true);
    await helper.given_communication_opt_in(agent, 'restock_alerts', false);

    const canSend = await testDeps.marketingConsentGuard.canSend(accountId, 'restock_alerts');
    expect(canSend).toBe(false);
  });
});

describe('Send In-Store Event Notification', () => {
  const helper = new CampaignsServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  const eventPayload = {
    eventTitle: EVENT_TITLE,
    storeName: STORE_CAM_NAME,
    storeCode: STORE_CAM,
  };

  it('Scenario 1: Notification sent when preferred store matches event store and opted in', async () => {
    const agent = helper.createSessionAgent();
    const accountId = await helper.given_logged_in_customer(agent, TOM_ACCOUNT);
    await helper.given_communication_opt_in(agent, 'events', true);
    await helper.given_preferred_store(agent, STORE_CAM);

    const result = await helper.when_admin_sends_in_store_event(eventPayload, {
      [accountId]: STORE_CAM,
    });

    expect(result.status).toBe(200);
    helper.then_dispatch_counts(result.body, { sent: 1, skipped: 0 });
  });

  it('Scenario 2: skipped when no preferred store matches event store', async () => {
    const agent = helper.createSessionAgent();
    const accountId = await helper.given_logged_in_customer(agent, MARIA);
    await helper.given_communication_opt_in(agent, 'events', true);

    const result = await helper.when_admin_sends_in_store_event(eventPayload, {
      [accountId]: '',
    });

    expect(result.status).toBe(200);
    helper.then_dispatch_counts(result.body, { sent: 0, skipped: 1 });
  });

  it('Scenario 3: skipped when eventNotificationsOptIn false even with matching store', async () => {
    const agent = helper.createSessionAgent();
    const accountId = await helper.given_logged_in_customer(agent, OPTED_OUT);
    await helper.given_preferred_store(agent, STORE_CAM);

    const result = await helper.when_admin_sends_in_store_event(eventPayload, {
      [accountId]: STORE_CAM,
    });

    expect(result.status).toBe(200);
    helper.then_dispatch_counts(result.body, { sent: 0, skipped: 1 });
  });
});
