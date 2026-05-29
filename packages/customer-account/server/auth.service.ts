import { randomUUID, randomBytes } from 'node:crypto';
import type { RegisterInput, LoginInput, AccountDashboardDto } from '@pawplace/customer-account-shared';
import { AccountVerificationStatus, listUnmetPasswordRequirements } from '@pawplace/customer-account-shared';
import type { CustomerAccountRepository, CustomerAccountRecord } from './customer-account.repository';
import { PasswordHasher } from './password-hasher';
import { VerificationTokenRepository, PasswordResetTokenRepository } from './token.repository';
import {
  EmailAlreadyRegisteredError,
  InvalidCredentialsError,
  UnverifiedAccountError,
  VerificationLinkError,
  PasswordResetLinkError,
} from './customer-account.errors';
import type { SessionService } from './session.service';

const VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;
const RESET_TTL_MS = 60 * 60 * 1000;

export class AuthService {
  constructor(
    private readonly accounts: CustomerAccountRepository,
    private readonly hasher: PasswordHasher,
    private readonly verificationTokens: VerificationTokenRepository,
    private readonly resetTokens: PasswordResetTokenRepository,
    private readonly sessionService: SessionService,
  ) {}

  async register(input: RegisterInput): Promise<{ queuedDelivery: boolean }> {
    const unmet = listUnmetPasswordRequirements(input.password);
    if (unmet.length > 0) {
      throw new Error(unmet.join('; '));
    }
    if (await this.accounts.existsByEmail(input.email)) {
      throw new EmailAlreadyRegisteredError();
    }
    const account: CustomerAccountRecord = {
      id: randomUUID(),
      email: input.email.toLowerCase(),
      passwordHash: this.hasher.hash(input.password),
      firstName: input.firstName,
      lastName: input.lastName,
      accountVerificationStatus: AccountVerificationStatus.unverified(),
    };
    await this.accounts.save(account);
    this.issueVerificationToken(account.id);
    return { queuedDelivery: false };
  }

  async login(input: LoginInput, sessionId: string): Promise<AccountDashboardDto> {
    const account = await this.accounts.findByEmail(input.email);
    if (!account || !this.hasher.verify(input.password, account.passwordHash)) {
      throw new InvalidCredentialsError();
    }
    if (!AccountVerificationStatus.gateCustomerSessionAccess(account.accountVerificationStatus)) {
      throw new UnverifiedAccountError();
    }
    await this.sessionService.createSession(account.id, sessionId);
    return this.toDashboard(account);
  }

  async verifyEmail(token: string): Promise<'success' | 'already_verified' | 'expired'> {
    const record = this.verificationTokens.find(token);
    if (!record) throw new VerificationLinkError('invalid', 'Invalid verification link');
    const account = await this.accounts.findById(record.accountId);
    if (!account) throw new VerificationLinkError('invalid', 'Invalid verification link');

    if (account.accountVerificationStatus === 'verified') {
      return 'already_verified';
    }
    if (record.consumed) {
      return 'already_verified';
    }
    if (Date.now() > record.expiresAt) {
      throw new VerificationLinkError('expired', 'This verification link has expired');
    }

    account.accountVerificationStatus = AccountVerificationStatus.verified();
    this.verificationTokens.consume(token);
    await this.accounts.save(account);
    return 'success';
  }

  async resendVerification(email: string): Promise<void> {
    const account = await this.accounts.findByEmail(email);
    if (!account || account.accountVerificationStatus === 'verified') return;
    this.issueVerificationToken(account.id);
  }

  async requestPasswordReset(email: string): Promise<void> {
    const account = await this.accounts.findByEmail(email);
    if (!account) return;
    const token = randomBytes(32).toString('hex');
    this.resetTokens.save({
      token,
      accountId: account.id,
      expiresAt: Date.now() + RESET_TTL_MS,
      consumed: false,
    });
  }

  async resetPassword(token: string, password: string): Promise<void> {
    const unmet = listUnmetPasswordRequirements(password);
    if (unmet.length > 0) throw new Error(unmet.join('; '));

    const record = this.resetTokens.find(token);
    if (!record) throw new PasswordResetLinkError('invalid', 'link expired');
    if (record.consumed) throw new PasswordResetLinkError('used', 'link expired');
    if (Date.now() > record.expiresAt) {
      throw new PasswordResetLinkError('expired', 'link expired');
    }

    const account = await this.accounts.findById(record.accountId);
    if (!account) throw new PasswordResetLinkError('invalid', 'link expired');

    account.passwordHash = this.hasher.hash(password);
    this.resetTokens.consume(token);
    await this.accounts.save(account);
    await this.sessionService.invalidateAllForAccount(account.id);
  }

  validateResetToken(token: string): { valid: boolean; error?: string } {
    const record = this.resetTokens.find(token);
    if (!record) return { valid: false, error: 'link expired' };
    if (record.consumed) return { valid: false, error: 'link already used' };
    if (Date.now() > record.expiresAt) return { valid: false, error: 'link expired' };
    return { valid: true };
  }

  private issueVerificationToken(accountId: string): string {
    const token = randomBytes(32).toString('hex');
    this.verificationTokens.save({
      token,
      accountId,
      expiresAt: Date.now() + VERIFICATION_TTL_MS,
      consumed: false,
    });
    return token;
  }

  private toDashboard(account: CustomerAccountRecord): AccountDashboardDto {
    return {
      email: account.email,
      accountVerificationStatus: account.accountVerificationStatus,
      firstName: account.firstName,
      lastName: account.lastName,
    };
  }
}
