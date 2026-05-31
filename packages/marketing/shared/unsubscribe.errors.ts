export class InvalidUnsubscribeTokenError extends Error {
  constructor() {
    super('Invalid or expired unsubscribe link');
    this.name = 'InvalidUnsubscribeTokenError';
  }
}
