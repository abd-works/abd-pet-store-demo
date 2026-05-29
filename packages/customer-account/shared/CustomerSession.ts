/** << Entity >> — authenticated browser session (Increment 4). */
export class CustomerSession {
  readonly sessionId: string;
  readonly authenticatedCustomerAccountId: string;
  readonly sessionToken: string;
  deviceContext: string;
  lastActivityTimestamp: Date;
  readonly inactivityTimeoutMinutes: number;
  private active: boolean;

  constructor(
    sessionId: string,
    authenticatedCustomerAccountId: string,
    sessionToken: string,
    deviceContext: string,
    inactivityTimeoutMinutes: number,
    lastActivityTimestamp: Date = new Date(),
  ) {
    this.sessionId = sessionId;
    this.authenticatedCustomerAccountId = authenticatedCustomerAccountId;
    this.sessionToken = sessionToken;
    this.deviceContext = deviceContext;
    this.lastActivityTimestamp = lastActivityTimestamp;
    this.inactivityTimeoutMinutes = inactivityTimeoutMinutes;
    this.active = true;
  }

  static start(
    accountId: string,
    sessionId: string,
    sessionToken: string,
    deviceContext: string,
    inactivityTimeoutMinutes: number,
    now: Date = new Date(),
  ): CustomerSession {
    return new CustomerSession(
      sessionId,
      accountId,
      sessionToken,
      deviceContext,
      inactivityTimeoutMinutes,
      now,
    );
  }

  isActive(now: Date = new Date()): boolean {
    if (!this.active) return false;
    const elapsedMs = now.getTime() - this.lastActivityTimestamp.getTime();
    return elapsedMs <= this.inactivityTimeoutMinutes * 60 * 1000;
  }

  invalidate(): void {
    this.active = false;
  }

  touch(now: Date = new Date()): void {
    this.lastActivityTimestamp = now;
  }

  get isValid(): boolean {
    return this.active;
  }
}
