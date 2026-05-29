export const RETURN_STATUSES = [
  'initiated',
  'label_generated',
  'shipped_back',
  'received',
  'inspected',
  'refund_processing',
  'completed',
] as const;

export type ReturnStatusLabel = (typeof RETURN_STATUSES)[number];

const VALID_TRANSITIONS: Record<ReturnStatusLabel, ReturnStatusLabel[]> = {
  initiated: ['label_generated', 'shipped_back', 'received'],
  label_generated: ['shipped_back', 'received'],
  shipped_back: ['received'],
  received: ['inspected'],
  inspected: ['refund_processing'],
  refund_processing: ['completed'],
  completed: [],
};

/** << ValueObject >> — lifecycle state machine for a return. */
export class ReturnStatus {
  readonly value: ReturnStatusLabel;

  constructor(value: ReturnStatusLabel) {
    this.value = value;
  }

  static initiated(): ReturnStatus {
    return new ReturnStatus('initiated');
  }

  canTransitionTo(next: ReturnStatusLabel): boolean {
    return VALID_TRANSITIONS[this.value].includes(next);
  }

  transitionTo(next: ReturnStatusLabel): ReturnStatus {
    if (!this.canTransitionTo(next)) {
      throw new Error(`cannot transition return status from "${this.value}" to "${next}"`);
    }
    return new ReturnStatus(next);
  }
}
