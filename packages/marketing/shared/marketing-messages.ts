import type { MarketingCategory } from '../../customer-account/shared/MarketingCategory';

export interface MarketingEmailMessage {
  accountId: string;
  category: MarketingCategory;
  recipientEmail: string;
  subject: string;
  html: string;
  referenceId: string;
  type: string;
}

export class PromotionalEmail {
  private constructor(readonly message: MarketingEmailMessage) {}

  static create(input: {
    accountId: string;
    recipientEmail: string;
    subject: string;
    bodyHtml: string;
    unsubscribeUrl: string;
  }): PromotionalEmail {
    return new PromotionalEmail({
      accountId: input.accountId,
      category: 'promotions',
      recipientEmail: input.recipientEmail,
      subject: input.subject,
      referenceId: `promo-${input.accountId}-${Date.now()}`,
      type: 'promotional_email',
      html: `${input.bodyHtml}<p><a href="${input.unsubscribeUrl}">Unsubscribe from promotions</a></p>`,
    });
  }
}

export class PersonalizedRecommendation {
  private constructor(readonly message: MarketingEmailMessage) {}

  static create(input: {
    accountId: string;
    recipientEmail: string;
    productNames: string[];
    unsubscribeUrl: string;
  }): PersonalizedRecommendation | null {
    if (input.productNames.length === 0) return null;

    const list = input.productNames.map((name) => `<li>${name}</li>`).join('');
    return new PersonalizedRecommendation({
      accountId: input.accountId,
      category: 'recommendations',
      recipientEmail: input.recipientEmail,
      subject: 'Personalized recommendations for you',
      referenceId: `rec-${input.accountId}-${Date.now()}`,
      type: 'personalized_recommendation',
      html: `<p>We picked these for you:</p><ul>${list}</ul><p><a href="${input.unsubscribeUrl}">Unsubscribe from recommendations</a></p>`,
    });
  }
}

export class RestockAlert {
  private constructor(readonly message: MarketingEmailMessage) {}

  static create(input: {
    accountId: string;
    recipientEmail: string;
    sku: string;
    productName: string;
    productUrl: string;
    unsubscribeUrl: string;
  }): RestockAlert {
    return new RestockAlert({
      accountId: input.accountId,
      category: 'restock_alerts',
      recipientEmail: input.recipientEmail,
      subject: `${input.productName} is back in stock`,
      referenceId: `restock-${input.accountId}-${input.sku}`,
      type: 'restock_alert',
      html: `<p>${input.productName} is back in stock.</p><p><a href="${input.productUrl}">View product</a></p><p><a href="${input.unsubscribeUrl}">Unsubscribe from restock alerts</a></p>`,
    });
  }
}

export class InStoreEventNotification {
  private constructor(readonly message: MarketingEmailMessage) {}

  static create(input: {
    accountId: string;
    recipientEmail: string;
    eventTitle: string;
    storeName: string;
    unsubscribeUrl: string;
  }): InStoreEventNotification {
    return new InStoreEventNotification({
      accountId: input.accountId,
      category: 'events',
      recipientEmail: input.recipientEmail,
      subject: `In-store event at ${input.storeName}`,
      referenceId: `event-${input.accountId}-${Date.now()}`,
      type: 'in_store_event_notification',
      html: `<p>${input.eventTitle} at ${input.storeName}</p><p><a href="${input.unsubscribeUrl}">Unsubscribe from event notifications</a></p>`,
    });
  }
}
