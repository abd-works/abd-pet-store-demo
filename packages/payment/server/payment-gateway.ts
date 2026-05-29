export interface IPaymentGateway {
  refund(paymentRef: string, amount: number): Promise<void>;
}
