export type AccountVerificationStatusValue = 'unverified' | 'verified';

/** CRC-aligned verification gate helpers (Increment 4). */
export const AccountVerificationStatus = {
  unverified(): AccountVerificationStatusValue {
    return 'unverified';
  },

  verified(): AccountVerificationStatusValue {
    return 'verified';
  },

  /** Blocks customer session creation with account-only access when unverified. */
  gateCustomerSessionAccess(status: AccountVerificationStatusValue): boolean {
    return status === 'verified';
  },
} as const;
