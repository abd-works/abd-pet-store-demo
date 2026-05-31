/**
 * Notification & communication preferences — server helper (Increment 8 Sprint 2)
 */
import assert from 'node:assert/strict';
import type { SuperAgentTest } from 'supertest';
import { ReturningCustomersServerHelper } from '../../../returning-customers/helpers/returning-customers.server';
import { ReturningCustomersBase } from '../../../returning-customers/helpers/returning-customers.base';

export class PreferencesServerHelper extends ReturningCustomersServerHelper {
  async given_logged_in_tom(agent: SuperAgentTest): Promise<void> {
    await this.given_logged_in_verified(agent);
  }

  async when_open_notification_preferences(agent: SuperAgentTest) {
    return agent.get('/api/account/notification-preferences');
  }

  async when_toggle_notification_category(
    agent: SuperAgentTest,
    category: string,
    enabled: boolean,
  ) {
    return agent.patch('/api/account/notification-preferences').send({ category, enabled });
  }

  async when_open_communication_preferences(agent: SuperAgentTest) {
    return agent.get('/api/account/communication-preferences');
  }

  async when_toggle_marketing_category(
    agent: SuperAgentTest,
    category: string,
    optedIn: boolean,
  ) {
    return agent.patch('/api/account/communication-preferences').send({ category, optedIn });
  }

  then_category_enabled(
    body: { categories: Array<{ category: string; enabled: boolean }> },
    category: string,
    enabled: boolean,
  ): void {
    const row = body.categories.find((c) => c.category === category);
    assert.ok(row, `expected category ${category}`);
    assert.strictEqual(row!.enabled, enabled);
  }

  then_category_opted_in(
    body: { categories: Array<{ category: string; status: string }> },
    category: string,
    status: 'opted-in' | 'opted-out',
  ): void {
    const row = body.categories.find((c) => c.category === category);
    assert.ok(row, `expected category ${category}`);
    assert.strictEqual(row!.status, status);
  }

  static readonly JANE = ReturningCustomersBase.JANE;
}
