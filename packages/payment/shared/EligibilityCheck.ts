/** << ValueObject >> — VaultPay per-transaction credit assessment result. */
export class EligibilityCheck {
  readonly creditAssessmentResult: string;
  readonly transactionEligible: boolean;

  constructor(creditAssessmentResult: string, transactionEligible: boolean) {
    this.creditAssessmentResult = creditAssessmentResult;
    this.transactionEligible = transactionEligible;
  }

  isHardDecline(): boolean {
    return !this.transactionEligible;
  }
}
