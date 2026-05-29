import type { CartService } from '../../cart/server/cart.service';
import { CustomerSessionRepository } from './customer-session.repository';
import type { CustomerAccountRepository } from './customer-account.repository';
import { AuthenticationRequiredError, UnverifiedAccountError } from './customer-account.errors';
import { AccountVerificationStatus } from '@pawplace/customer-account-shared';

export interface CustomerPrincipal {
  accountId: string;
  email: string;
  sessionId: string;
}

export class SessionService {
  constructor(
    private readonly sessions: CustomerSessionRepository,
    private readonly accounts: CustomerAccountRepository,
    private readonly cartService: CartService,
  ) {}

  async createSession(accountId: string, sessionId: string): Promise<void> {
    this.sessions.save({
      sessionId,
      accountId,
      createdAt: Date.now(),
      lastActiveAt: Date.now(),
    });
  }

  async invalidate(sessionId: string): Promise<void> {
    this.sessions.delete(sessionId);
  }

  async invalidateAllForAccount(accountId: string): Promise<void> {
    this.sessions.deleteAllForAccount(accountId);
  }

  async mergeGuestCartOnLogin(sessionId: string, accountId: string): Promise<void> {
    await this.cartService.mergeGuestCartIntoAccount(sessionId, accountId);
  }

  resolvePrincipal(sessionId: string | undefined): CustomerPrincipal | null {
    if (!sessionId) return null;
    const record = this.sessions.find(sessionId);
    if (!record) return null;
    this.sessions.touch(sessionId);
    return { accountId: record.accountId, email: '', sessionId };
  }

  async requireVerifiedPrincipal(sessionId: string | undefined): Promise<CustomerPrincipal> {
    if (!sessionId) throw new AuthenticationRequiredError();
    const record = this.sessions.find(sessionId);
    if (!record) throw new AuthenticationRequiredError();

    const account = await this.accounts.findById(record.accountId);
    if (!account) throw new AuthenticationRequiredError();
    if (!AccountVerificationStatus.gateCustomerSessionAccess(account.accountVerificationStatus)) {
      throw new UnverifiedAccountError();
    }

    this.sessions.touch(sessionId);
    return { accountId: record.accountId, email: account.email, sessionId };
  }
}
