/**
 * Marketing campaigns — server helper (Increment 8 Sprint 3)
 */
import assert from 'node:assert/strict';
import request from 'supertest';
import type { SuperAgentTest } from 'supertest';
import { app, testDeps } from '@pawplace/app-server';
import type { CustomerAccountTestData } from '../../../returning-customers/helpers/returning-customers.base';
import { PreferencesServerHelper } from '../../preferences/helpers/preferences.server';
import { CAMPAIGN_SUBJECT, STORE_CAM } from './campaigns.base';

export interface DispatchResultBody {
  sent: number;
  skipped: number;
  queued: number;
}

export class CampaignsServerHelper extends PreferencesServerHelper {
  async resolveAccountId(email: string): Promise<string> {
    const account = await testDeps.customerAccountModule.accounts.findByEmail(email);
    assert.ok(account, `expected account for ${email}`);
    return account!.id;
  }

  async given_logged_in_customer(agent: SuperAgentTest, customer: CustomerAccountTestData): Promise<string> {
    await this.given_logged_in_verified(agent, customer);
    return this.resolveAccountId(customer.email);
  }

  async given_communication_opt_in(
    agent: SuperAgentTest,
    category: string,
    optedIn: boolean,
  ): Promise<void> {
    const response = await this.when_toggle_marketing_category(agent, category, optedIn);
    assert.strictEqual(response.status, 200, JSON.stringify(response.body));
  }

  async given_wishlist_contains(agent: SuperAgentTest, sku: string): Promise<void> {
    const response = await agent.post('/api/wishlist').send({ sku });
    assert.strictEqual(response.status, 201, JSON.stringify(response.body));
  }

  async given_preferred_store(agent: SuperAgentTest, storeCode: string = STORE_CAM): Promise<void> {
    const response = await agent.put('/api/account/my-store').send({ storeCode });
    assert.strictEqual(response.status, 200, JSON.stringify(response.body));
  }

  async when_admin_sends_promotional_batch(input: {
    subject: string;
    bodyHtml: string;
    recipientAccountIds: string[];
  }) {
    return request(app).post('/api/admin/marketing/promotional').send(input);
  }

  async when_admin_sends_personalized_recommendation(accountId: string) {
    return request(app).post('/api/admin/marketing/recommendation').send({ accountId });
  }

  async when_admin_sends_restock_alert(sku: string, productName: string) {
    return request(app).post('/api/admin/marketing/restock-alert').send({ sku, productName });
  }

  async when_admin_sends_in_store_event(
    event: { eventTitle: string; storeName: string; storeCode: string },
    preferredStores: Record<string, string>,
  ) {
    return request(app)
      .post('/api/admin/marketing/in-store-event')
      .send({ ...event, preferredStores });
  }

  then_dispatch_counts(body: DispatchResultBody, expected: Partial<DispatchResultBody>): void {
    if (expected.sent !== undefined) assert.strictEqual(body.sent, expected.sent);
    if (expected.skipped !== undefined) assert.strictEqual(body.skipped, expected.skipped);
    if (expected.queued !== undefined) assert.strictEqual(body.queued, expected.queued);
  }

  static readonly defaultPromotionalBody = {
    subject: CAMPAIGN_SUBJECT,
    bodyHtml: '<p>Save 20% on toys this spring</p>',
  };
}
