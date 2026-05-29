import { VerificationLink } from './VerificationLink';
import { AccountVerificationStatus } from './AccountVerificationStatus';

export interface AccountVerificationTarget {
  accountVerificationStatus: import('./AccountVerificationStatus').AccountVerificationStatusValue;
}

/** << Entity >> — mandatory email verification lifecycle (Increment 4). */
export class EmailVerification {
  readonly targetCustomerAccountId: string;
  verificationLink: VerificationLink;

  constructor(targetCustomerAccountId: string, verificationLink: VerificationLink) {
    this.targetCustomerAccountId = targetCustomerAccountId;
    this.verificationLink = verificationLink;
  }

  static forAccount(accountId: string, token: string, ttlHours: number): EmailVerification {
    return new EmailVerification(accountId, VerificationLink.create(token, ttlHours));
  }

  /** CRC: transition account verification status when customer clicks valid non-expired link. */
  transitionAccountVerificationStatus(account: AccountVerificationTarget): void {
    if (this.verificationLink.isExpired()) {
      throw new Error('verification link expired');
    }
    if (this.verificationLink.isUsed() && account.accountVerificationStatus === 'verified') {
      return;
    }
    this.verificationLink.consume();
    account.accountVerificationStatus = AccountVerificationStatus.verified();
  }

  /** CRC: block account-only features until email ownership confirmed. */
  static blockAccountOnlyFeatures(
    accountVerificationStatus: import('./AccountVerificationStatus').AccountVerificationStatusValue,
  ): boolean {
    return !AccountVerificationStatus.gateCustomerSessionAccess(accountVerificationStatus);
  }
}
