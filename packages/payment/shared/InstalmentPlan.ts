/** << ValueObject >> — VaultPay-approved BNPL schedule presented before capture. */
export class InstalmentPlan {
  readonly installmentCount: number;
  readonly installmentAmount: number;
  readonly installmentSchedule: Date[];
  readonly instalmentReference: string;

  constructor(params: {
    installmentCount: number;
    installmentAmount: number;
    installmentSchedule: Date[];
    instalmentReference: string;
  }) {
    if (params.installmentCount < 1) throw new Error('installment count must be at least one');
    if (params.installmentAmount <= 0) throw new Error('installment amount must be positive');
    this.installmentCount = params.installmentCount;
    this.installmentAmount = params.installmentAmount;
    this.installmentSchedule = [...params.installmentSchedule];
    this.instalmentReference = params.instalmentReference;
  }
}
