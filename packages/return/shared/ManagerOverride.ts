/** << ValueObject >> — manager approval for an in-store return that fails standard eligibility. */
export class ManagerOverride {
  readonly approvingManager: string;
  readonly overrideReason: string;
  readonly approvedAt: Date;

  constructor(
    approvingManagerOrParams: string | { approvingManager: string; overrideReason: string; approvedAt?: Date },
    overrideReason?: string,
  ) {
    if (typeof approvingManagerOrParams === 'string') {
      if (!approvingManagerOrParams.trim()) {
        throw new Error('approving manager identity is required');
      }
      if (!overrideReason || !overrideReason.trim()) {
        throw new Error('override reason is required');
      }
      this.approvingManager = approvingManagerOrParams;
      this.overrideReason = overrideReason;
      this.approvedAt = new Date();
    } else {
      if (!approvingManagerOrParams.approvingManager.trim()) {
        throw new Error('approving manager identity is required');
      }
      if (!approvingManagerOrParams.overrideReason.trim()) {
        throw new Error('override reason is required');
      }
      this.approvingManager = approvingManagerOrParams.approvingManager;
      this.overrideReason = approvingManagerOrParams.overrideReason;
      this.approvedAt = approvingManagerOrParams.approvedAt ?? new Date();
    }
  }

  toAuditRecord(): { approvingManager: string; overrideReason: string; approvedAt: string } {
    return {
      approvingManager: this.approvingManager,
      overrideReason: this.overrideReason,
      approvedAt: this.approvedAt.toISOString(),
    };
  }
}
