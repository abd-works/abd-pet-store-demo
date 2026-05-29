/** << ValueObject >> — one-time email verification or password-reset link (Increment 4). */
export class VerificationLink {
  readonly uniqueLinkToken: string;
  readonly expiryTime: Date;
  oneTimeUseFlag: boolean;

  constructor(uniqueLinkToken: string, expiryTime: Date, oneTimeUseFlag = false) {
    if (!uniqueLinkToken.trim()) throw new Error('verification link token is required');
    this.uniqueLinkToken = uniqueLinkToken;
    this.expiryTime = expiryTime;
    this.oneTimeUseFlag = oneTimeUseFlag;
  }

  static create(token: string, ttlHours: number, now: Date = new Date()): VerificationLink {
    const expiryTime = new Date(now.getTime() + ttlHours * 60 * 60 * 1000);
    return new VerificationLink(token, expiryTime, false);
  }

  isExpired(now: Date = new Date()): boolean {
    return this.expiryTime < now;
  }

  isUsed(): boolean {
    return this.oneTimeUseFlag;
  }

  consume(): void {
    this.oneTimeUseFlag = true;
  }
}
