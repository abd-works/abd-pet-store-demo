export const REFUND_STATUSES = ['processing', 'completed', 'requires_review'] as const;

export type RefundStatusLabel = (typeof REFUND_STATUSES)[number];

const VALID_TRANSITIONS: Record<RefundStatusLabel, RefundStatusLabel[]> = {
  processing: ['completed', 'requires_review'],
  completed: [],
  requires_review: [],
};

/** << ValueObject >> — customer-visible refund lifecycle: processing → completed | requires_review. */
export class RefundStatus {
  readonly value: RefundStatusLabel;

  constructor(value: RefundStatusLabel) {
    this.value = value;
  }

  static processing(): RefundStatus {
    return new RefundStatus('processing');
  }

  canTransitionTo(next: RefundStatusLabel): boolean {
    return VALID_TRANSITIONS[this.value].includes(next);
  }

  transitionTo(next: RefundStatusLabel): RefundStatus {
    if (!this.canTransitionTo(next)) {
      throw new Error(`cannot transition refund status from "${this.value}" to "${next}"`);
    }
    return new RefundStatus(next);
  }

  get timingExpectationNote(): string | undefined {
    if (this.value === 'processing') {
      return 'refunds typically take 5–10 business days depending on your payment provider';
    }
    return undefined;
  }

  get supportGuidance(): string | undefined {
    if (this.value === 'requires_review') {
      return 'your refund requires manual review — please contact support if you need assistance';
    }
    return undefined;
  }
}
