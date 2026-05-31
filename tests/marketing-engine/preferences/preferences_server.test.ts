/**
 * Notification & communication preferences — server tests (Increment 8 Sprint 2)
 *
 * File: preferences_server.test.ts (area: marketing-engine/preferences)
 * Classes: Set Notification Preferences | Set Communication Preferences | Opt In to Marketing Email List
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { CommunicationPreferences } from '../../../packages/customer-account/shared/CommunicationPreferences';
import { NotificationPreferences } from '../../../packages/notification/shared/NotificationPreferences';
import { NotificationService } from '../../../packages/notification/server/notification.service';
import { testDeps } from '@pawplace/app-server';
import { PreferencesServerHelper } from './helpers/preferences.server';
import { OPT_IN_TIMESTAMP } from './helpers/preferences.base';

describe('Communication Preferences domain', () => {
  it('defaults all marketing categories to opted-out', () => {
    const communicationPreferences = CommunicationPreferences.createDefault('acc-1');
    expect(communicationPreferences.isOptedIn('promotions')).toBe(false);
    expect(communicationPreferences.isOptedIn('restock_alerts')).toBe(false);
  });

  it('tracks marketing email list membership from any opt-in', () => {
    const communicationPreferences = CommunicationPreferences.createDefault('acc-1');
    communicationPreferences.toggle('promotions', true, OPT_IN_TIMESTAMP);
    expect(communicationPreferences.toSnapshot().onMarketingEmailList).toBe(true);
  });

  it('Scenario 3: new marketing category defaults to opted-out for existing snapshot', () => {
    const communicationPreferences = CommunicationPreferences.fromSnapshot({
      accountId: 'acc-1',
      onMarketingEmailList: false,
      categories: [
        { category: 'promotions', status: 'opted-out' },
        { category: 'recommendations', status: 'opted-out' },
        { category: 'restock_alerts', status: 'opted-in', optedInAt: OPT_IN_TIMESTAMP },
        { category: 'events', status: 'opted-out' },
      ],
    });
    expect(communicationPreferences.isOptedIn('promotions')).toBe(false);
    expect(communicationPreferences.isOptedIn('restock_alerts')).toBe(true);
  });
});

describe('Notification Preferences domain', () => {
  it('defaults transactional categories to enabled', () => {
    const notificationPreferences = NotificationPreferences.createDefault('acc-1');
    expect(notificationPreferences.isEnabled('shipping')).toBe(true);
  });
});

describe('Transactional notification gating', () => {
  it('Scenario 2: disabled shipping blocks optional send; order_updates still respected', async () => {
    const notificationPreferences = NotificationPreferences.createDefault('acc-1');
    notificationPreferences.setCategory('shipping', false);

    const prefsService = {
      isEnabled: async (_accountId: string, category: string) =>
        notificationPreferences.isEnabled(category as 'shipping'),
    };

    const sent: string[] = [];
    const notificationService = new NotificationService(
      { send: async (msg) => { sent.push(msg.subject); } },
      { markSent: async () => {}, enqueue: async () => {} },
      prefsService as never,
    );

    const shippingBlocked = await notificationService.sendTransactional(
      'acc-1',
      'tom.nguyen@pawplace.example',
      { to: 'tom.nguyen@pawplace.example', subject: 'Shipped', html: '<p>Shipped</p>' },
      { category: 'shipping', mandatory: false },
    );
    expect(shippingBlocked).toBe(false);

    const orderUpdatesSent = await notificationService.sendTransactional(
      'acc-1',
      'tom.nguyen@pawplace.example',
      { to: 'tom.nguyen@pawplace.example', subject: 'Order update', html: '<p>Update</p>' },
      { category: 'order_updates', mandatory: false },
    );
    expect(orderUpdatesSent).toBe(true);
  });

  it('Scenario 3: mandatory order confirmation sends when all optional categories disabled', async () => {
    const notificationPreferences = NotificationPreferences.createDefault('acc-1');
    for (const category of ['order_updates', 'shipping', 'appointments', 'returns'] as const) {
      notificationPreferences.setCategory(category, false);
    }

    const prefsService = {
      isEnabled: async () => false,
    };

    const sent: string[] = [];
    const notificationService = new NotificationService(
      { send: async (msg) => { sent.push(msg.subject); } },
      { markSent: async () => {}, enqueue: async () => {} },
      prefsService as never,
    );

    const confirmationSent = await notificationService.sendTransactional(
      'acc-1',
      'tom.nguyen@pawplace.example',
      { to: 'tom.nguyen@pawplace.example', subject: 'Order confirmation', html: '<p>Confirmed</p>' },
      { category: 'order_updates', mandatory: true },
    );
    expect(confirmationSent).toBe(true);
    expect(sent).toContain('Order confirmation');
  });
});

describe('Set Communication Preferences', () => {
  const helper = new PreferencesServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Scenario 1: marketing categories listed with opt-in status', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_logged_in_tom(agent);

    const response = await helper.when_open_communication_preferences(agent);
    expect(response.status).toBe(200);
    helper.then_category_opted_in(response.body, 'promotions', 'opted-out');
    helper.then_category_opted_in(response.body, 'recommendations', 'opted-out');
    helper.then_category_opted_in(response.body, 'restock_alerts', 'opted-out');
    helper.then_category_opted_in(response.body, 'events', 'opted-out');
  });

  it('Scenario 2: toggle persists immediately and updates marketing email list', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_logged_in_tom(agent);

    const toggle = await helper.when_toggle_marketing_category(agent, 'promotions', true);
    expect(toggle.status).toBe(200);
    expect(toggle.body.onMarketingEmailList).toBe(true);

    const get = await helper.when_open_communication_preferences(agent);
    helper.then_category_opted_in(get.body, 'promotions', 'opted-in');
  });

  it('Scenario 5: guest receives 401 on communication preferences', async () => {
    const guest = helper.createSessionAgent();
    const response = await helper.when_open_communication_preferences(guest);
    expect(response.status).toBe(401);
  });
});

describe('Set Notification Preferences', () => {
  const helper = new PreferencesServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Scenario 1: transactional categories listed with current on/off settings', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_logged_in_tom(agent);

    const response = await helper.when_open_notification_preferences(agent);
    expect(response.status).toBe(200);
    helper.then_category_enabled(response.body, 'order_updates', true);
    helper.then_category_enabled(response.body, 'shipping', true);
    helper.then_category_enabled(response.body, 'appointments', true);
    helper.then_category_enabled(response.body, 'returns', true);
  });

  it('Scenario 2: shipping toggle persists immediately', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_logged_in_tom(agent);

    const toggle = await helper.when_toggle_notification_category(agent, 'shipping', false);
    expect(toggle.status).toBe(200);

    const get = await helper.when_open_notification_preferences(agent);
    helper.then_category_enabled(get.body, 'shipping', false);
    expect(get.body.criticalNote).toContain('order confirmation');
  });

  it('Scenario 4: guest receives 401 on notification preferences', async () => {
    const guest = helper.createSessionAgent();
    const response = await helper.when_open_notification_preferences(guest);
    expect(response.status).toBe(401);
  });
});

describe('Opt In to Marketing Email List', () => {
  const helper = new PreferencesServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Scenario 1: promotions opt-in adds customer to marketing email list', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_logged_in_tom(agent);

    const toggle = await helper.when_toggle_marketing_category(agent, 'promotions', true);
    expect(toggle.status).toBe(200);
    expect(toggle.body.onMarketingEmailList).toBe(true);

    const promo = toggle.body.categories.find(
      (c: { category: string }) => c.category === 'promotions',
    );
    expect(promo.status).toBe('opted-in');
    expect(promo.optedInAt).toBeTruthy();
  });

  it('Scenario 4: no marketing send when every category opted-out', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_logged_in_tom(agent);

    const account = await testDeps.customerAccountModule.accounts.findByEmail(
      PreferencesServerHelper.JANE.email,
    );
    expect(account).toBeTruthy();

    const canSend = await testDeps.marketingConsentGuard.canSend(account!.id, 'promotions');
    expect(canSend).toBe(false);
  });

  it('Scenario 5: opting out of last category removes from marketing email list', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_logged_in_tom(agent);

    await helper.when_toggle_marketing_category(agent, 'promotions', true);
    const optOut = await helper.when_toggle_marketing_category(agent, 'promotions', false);
    expect(optOut.status).toBe(200);
    expect(optOut.body.onMarketingEmailList).toBe(false);
    helper.then_category_opted_in(optOut.body, 'promotions', 'opted-out');
  });
});

describe('Marketing consent guard', () => {
  const helper = new PreferencesServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('blocks send after realtime opt-out', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_logged_in_tom(agent);

    const account = await testDeps.customerAccountModule.accounts.findByEmail(
      PreferencesServerHelper.JANE.email,
    );
    expect(account).toBeTruthy();
    const accountId = account!.id;

    await helper.when_toggle_marketing_category(agent, 'promotions', true);
    const canSendBefore = await testDeps.marketingConsentGuard.canSend(accountId, 'promotions');
    expect(canSendBefore).toBe(true);

    await helper.when_toggle_marketing_category(agent, 'promotions', false);
    const canSendAfter = await testDeps.marketingConsentGuard.canSend(accountId, 'promotions');
    expect(canSendAfter).toBe(false);
  });
});
