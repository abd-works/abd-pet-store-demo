import { createHmac, timingSafeEqual } from 'node:crypto';
import type { MarketingCategory } from '../../customer-account/shared/MarketingCategory';
import { isMarketingCategory } from '../../customer-account/shared/MarketingCategory';
import { InvalidUnsubscribeTokenError } from './unsubscribe.errors';

const DEFAULT_SECRET = 'pawplace-unsubscribe-dev-secret';

function secret(): string {
  return process.env.UNSUBSCRIBE_TOKEN_SECRET ?? DEFAULT_SECRET;
}

export interface UnsubscribeTokenPayload {
  accountId: string;
  category: MarketingCategory;
}

function signPayload(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('hex');
}

export class UnsubscribeToken {
  static sign(accountId: string, category: MarketingCategory): string {
    const payload = `${accountId}:${category}`;
    const encoded = Buffer.from(payload, 'utf8').toString('base64url');
    const signature = signPayload(payload);
    return `${encoded}.${signature}`;
  }

  static verify(token: string): UnsubscribeTokenPayload {
    const dotIndex = token.indexOf('.');
    if (dotIndex <= 0) throw new InvalidUnsubscribeTokenError();

    const encoded = token.slice(0, dotIndex);
    const signature = token.slice(dotIndex + 1);
    let payload: string;
    try {
      payload = Buffer.from(encoded, 'base64url').toString('utf8');
    } catch {
      throw new InvalidUnsubscribeTokenError();
    }

    const expected = signPayload(payload);
    if (expected.length !== signature.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) {
      throw new InvalidUnsubscribeTokenError();
    }

    const colonIndex = payload.indexOf(':');
    if (colonIndex <= 0) throw new InvalidUnsubscribeTokenError();

    const accountId = payload.slice(0, colonIndex);
    const category = payload.slice(colonIndex + 1);
    if (!isMarketingCategory(category)) throw new InvalidUnsubscribeTokenError();

    return { accountId, category };
  }

  static buildUrl(accountId: string, category: MarketingCategory): string {
    return `/api/marketing/unsubscribe/${this.sign(accountId, category)}`;
  }
}
