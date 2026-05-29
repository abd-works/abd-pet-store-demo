export class EmailAlreadyRegisteredError extends Error {
  constructor() {
    super('This email is already in use');
    this.name = 'EmailAlreadyRegisteredError';
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('invalid email or password');
    this.name = 'InvalidCredentialsError';
  }
}

export class UnverifiedAccountError extends Error {
  constructor() {
    super('please verify your email first');
    this.name = 'UnverifiedAccountError';
  }
}

export class VerificationLinkError extends Error {
  readonly code: 'expired' | 'used' | 'invalid';

  constructor(code: 'expired' | 'used' | 'invalid', message: string) {
    super(message);
    this.name = 'VerificationLinkError';
    this.code = code;
  }
}

export class PasswordResetLinkError extends Error {
  readonly code: 'expired' | 'used' | 'invalid';

  constructor(code: 'expired' | 'used' | 'invalid', message: string) {
    super(message);
    this.name = 'PasswordResetLinkError';
    this.code = code;
  }
}

export class AuthenticationRequiredError extends Error {
  constructor() {
    super('Authentication required');
    this.name = 'AuthenticationRequiredError';
  }
}

export class DefaultAddressDeletionRequiresReplacementError extends Error {
  constructor() {
    super('select new default address');
    this.name = 'DefaultAddressDeletionRequiresReplacementError';
  }
}

export class DefaultPaymentDeletionRequiresReplacementError extends Error {
  constructor() {
    super('select new default payment method');
    this.name = 'DefaultPaymentDeletionRequiresReplacementError';
  }
}
