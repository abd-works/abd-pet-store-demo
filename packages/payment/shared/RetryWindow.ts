/** << ValueObject >> — bounds automatic payment retry attempts. */
export class RetryWindow {
  readonly maximumAttemptCount: number;
  readonly timeLimitMs: number;

  constructor(maximumAttemptCount: number, timeLimitMs: number) {
    if (maximumAttemptCount < 1) throw new Error('maximum attempt count must be at least one');
    if (timeLimitMs < 1) throw new Error('time limit must be positive');
    this.maximumAttemptCount = maximumAttemptCount;
    this.timeLimitMs = timeLimitMs;
  }

  isExhausted(attemptCount: number, startedAtMs: number, nowMs: number = Date.now()): boolean {
    return attemptCount >= this.maximumAttemptCount || nowMs - startedAtMs > this.timeLimitMs;
  }

  static default(): RetryWindow {
    return new RetryWindow(3, 60_000);
  }
}
