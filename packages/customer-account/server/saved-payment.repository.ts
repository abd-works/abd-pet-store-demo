import type { SavedPaymentMethodDto, SavedPaymentVendor } from '@pawplace/customer-account-shared';
import { randomUUID } from 'node:crypto';

export type StoredSavedPaymentMethod = SavedPaymentMethodDto & { vendorToken: string };

interface PaymentBookState {
  methods: StoredSavedPaymentMethod[];
}

export class SavedPaymentRepository {
  private readonly books = new Map<string, PaymentBookState>();

  load(accountId: string): PaymentBookState {
    return this.books.get(accountId) ?? { methods: [] };
  }

  save(accountId: string, state: PaymentBookState): void {
    this.books.set(accountId, state);
  }
}

export function createSavedPaymentMethod(params: {
  lastFour: string;
  cardType: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  vendorToken: string;
  vendor?: SavedPaymentVendor;
}): StoredSavedPaymentMethod {
  const now = new Date();
  const vendor = params.vendor ?? 'stripewave';
  const isExpired =
    vendor === 'stripewave' &&
    (params.expiryYear < now.getFullYear() ||
      (params.expiryYear === now.getFullYear() && params.expiryMonth < now.getMonth() + 1));

  return {
    id: randomUUID(),
    lastFour: params.lastFour,
    cardType: params.cardType,
    expiryMonth: params.expiryMonth,
    expiryYear: params.expiryYear,
    isDefault: params.isDefault,
    isExpired,
    vendor,
    vendorToken: params.vendorToken,
  };
}

export class SavedPaymentTokenStore {
  private readonly tokens = new Map<string, string>();

  set(methodId: string, vendorToken: string): void {
    this.tokens.set(methodId, vendorToken);
  }

  get(methodId: string): string | null {
    return this.tokens.get(methodId) ?? null;
  }

  delete(methodId: string): void {
    this.tokens.delete(methodId);
  }
}
