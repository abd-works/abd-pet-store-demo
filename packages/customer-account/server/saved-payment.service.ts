import type {
  SavedPaymentMethodDto,
  SavedPaymentVendor,
  SaveVendorPaymentMethodInput,
} from '@pawplace/customer-account-shared';
import {
  SavedPaymentRepository,
  SavedPaymentTokenStore,
  createSavedPaymentMethod,
} from './saved-payment.repository';
import { DefaultPaymentDeletionRequiresReplacementError } from './customer-account.errors';

export class SavedPaymentService {
  constructor(
    private readonly repository: SavedPaymentRepository,
    private readonly tokenStore: SavedPaymentTokenStore,
  ) {}

  list(accountId: string): SavedPaymentMethodDto[] {
    return this.repository.load(accountId).methods.map((method) => ({
      id: method.id,
      lastFour: method.lastFour,
      cardType: method.cardType,
      expiryMonth: method.expiryMonth,
      expiryYear: method.expiryYear,
      isDefault: method.isDefault,
      isExpired: method.isExpired,
      vendor: method.vendor,
    }));
  }

  getMethod(accountId: string, methodId: string): SavedPaymentMethodDto | null {
    const method = this.repository.load(accountId).methods.find((m) => m.id === methodId);
    if (!method) return null;
    return {
      id: method.id,
      lastFour: method.lastFour,
      cardType: method.cardType,
      expiryMonth: method.expiryMonth,
      expiryYear: method.expiryYear,
      isDefault: method.isDefault,
      isExpired: method.isExpired,
      vendor: method.vendor,
    };
  }

  listSelectableForCheckout(accountId: string): SavedPaymentMethodDto[] {
    return this.list(accountId).filter((m) => !m.isExpired);
  }

  addFromCheckout(
    accountId: string,
    params: {
      lastFour: string;
      cardType: string;
      expiryMonth: number;
      expiryYear: number;
      vendorToken: string;
      vendor?: SavedPaymentVendor;
    },
  ): SavedPaymentMethodDto {
    const book = this.repository.load(accountId);
    const isDefault = book.methods.length === 0;
    const method = createSavedPaymentMethod({ ...params, isDefault });
    this.tokenStore.set(method.id, method.vendorToken);
    const { vendorToken: _, ...dto } = method;
    book.methods.push(method);
    this.repository.save(accountId, book);
    return dto;
  }

  addVendorSavedMethod(accountId: string, input: SaveVendorPaymentMethodInput): SavedPaymentMethodDto {
    if (input.vendor === 'paynova') {
      return this.addFromCheckout(accountId, {
        lastFour: '0000',
        cardType: 'PayNova',
        expiryMonth: 12,
        expiryYear: 2099,
        vendorToken: input.vendorToken,
        vendor: 'paynova',
      });
    }
    if (input.vendor === 'vaultpay') {
      return this.addFromCheckout(accountId, {
        lastFour: '0000',
        cardType: 'VaultPay',
        expiryMonth: 12,
        expiryYear: 2099,
        vendorToken: input.vendorToken,
        vendor: 'vaultpay',
      });
    }
    const lastFour = input.vendorToken.slice(-4).padStart(4, '0').slice(-4);
    return this.addFromCheckout(accountId, {
      lastFour,
      cardType: 'Visa',
      expiryMonth: 12,
      expiryYear: 2030,
      vendorToken: input.vendorToken,
      vendor: 'stripewave',
    });
  }

  remove(accountId: string, methodId: string, newDefaultId?: string): void {
    const book = this.repository.load(accountId);
    const target = book.methods.find((m) => m.id === methodId);
    if (!target) return;

    if (target.isDefault && book.methods.length > 1 && !newDefaultId) {
      throw new DefaultPaymentDeletionRequiresReplacementError();
    }

    book.methods = book.methods.filter((m) => m.id !== methodId);
    this.tokenStore.delete(methodId);
    if (newDefaultId) {
      for (const method of book.methods) {
        method.isDefault = method.id === newDefaultId;
      }
    } else if (book.methods.length === 1) {
      book.methods[0].isDefault = true;
    }
    this.repository.save(accountId, book);
  }

  setDefault(accountId: string, methodId: string): void {
    const book = this.repository.load(accountId);
    for (const method of book.methods) {
      method.isDefault = method.id === methodId;
    }
    this.repository.save(accountId, book);
  }

  getVendorToken(accountId: string, methodId: string): string | null {
    const book = this.repository.load(accountId);
    const method = book.methods.find((m) => m.id === methodId);
    if (!method || method.isExpired) return null;
    return this.tokenStore.get(methodId);
  }

  getDefault(accountId: string): SavedPaymentMethodDto | null {
    return this.list(accountId).find((m) => m.isDefault) ?? null;
  }
}
