import type { Request, Response } from 'express';
import { HttpStatus } from '../../shared/http-status';
import type { InMemoryCustomerAccountRepository } from './customer-account.repository';
import type { VerificationTokenRepository, PasswordResetTokenRepository } from './token.repository';

import type { SavedPaymentService } from './saved-payment.service';

export class CustomerAccountFixtureApi {
  constructor(
    private readonly accounts: InMemoryCustomerAccountRepository,
    private readonly verificationTokens: VerificationTokenRepository,
    private readonly resetTokens: PasswordResetTokenRepository,
    private readonly savedPayment?: SavedPaymentService,
  ) {}

  getVerificationToken = async (req: Request, res: Response): Promise<void> => {
    const email = String(req.query.email ?? '').toLowerCase();
    const account = await this.accounts.findByEmail(email);
    if (!account) {
      res.status(HttpStatus.NOT_FOUND).json({ error: 'account not found' });
      return;
    }
    const record = this.verificationTokens.findLatestForAccount(account.id);
    res.json({ token: record?.token ?? null });
  };

  getResetToken = async (req: Request, res: Response): Promise<void> => {
    const email = String(req.query.email ?? '').toLowerCase();
    const account = await this.accounts.findByEmail(email);
    if (!account) {
      res.status(HttpStatus.NOT_FOUND).json({ error: 'account not found' });
      return;
    }
    const record = this.resetTokens.findLatestForAccount(account.id);
    res.json({ token: record?.token ?? null });
  };

  expireVerificationToken = async (req: Request, res: Response): Promise<void> => {
    const token = String(req.body.token ?? '');
    this.verificationTokens.expireToken(token);
    res.json({ ok: true });
  };

  markVerified = async (req: Request, res: Response): Promise<void> => {
    const email = String(req.body.email ?? '');
    await this.accounts.markVerified(email);
    res.json({ ok: true });
  };

  deleteAccounts = async (req: Request, res: Response): Promise<void> => {
    const ids = req.body.ids as string[] | undefined;
    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'ids array required' });
      return;
    }
    await this.accounts.deleteByIds(ids);
    res.json({ ok: true });
  };

  seedPaymentMethod = async (req: Request, res: Response): Promise<void> => {
    if (!this.savedPayment) {
      res.status(HttpStatus.NOT_IMPLEMENTED).json({ error: 'saved payment not configured' });
      return;
    }
    const body = req.body as {
      email?: string;
      lastFour?: string;
      cardType?: string;
      expiryMonth?: number;
      expiryYear?: number;
      vendorToken?: string;
      expired?: boolean;
    };
    const account = await this.accounts.findByEmail(String(body.email ?? ''));
    if (!account) {
      res.status(HttpStatus.NOT_FOUND).json({ error: 'account not found' });
      return;
    }
    const cardType = body.cardType ?? 'Visa';
    const vendor =
      /paynova/i.test(cardType) ? 'paynova' : /vaultpay/i.test(cardType) ? 'vaultpay' : 'stripewave';
    const method = this.savedPayment.addFromCheckout(account.id, {
      lastFour: body.lastFour ?? '4242',
      cardType,
      expiryMonth: body.expiryMonth ?? 12,
      expiryYear: body.expiryYear ?? 2027,
      vendorToken: body.vendorToken ?? 'tok_sw_4242',
      vendor,
    });
    res.status(HttpStatus.CREATED).json({ ...method, processingVendorCode: method.vendor });
  };
}
