/** << ValueObject >> — printable return shipping label with carrier barcode and return address. */
export class ReturnLabel {
  readonly returnAddress: string;
  readonly orderNumber: string;
  readonly returnReference: string;
  readonly carrierBarcode: string;
  readonly labelUrl?: string;

  constructor(params: {
    returnAddress: string;
    orderNumber: string;
    returnReference: string;
    carrierBarcode: string;
    labelUrl?: string;
  }) {
    this.returnAddress = params.returnAddress;
    this.orderNumber = params.orderNumber;
    this.returnReference = params.returnReference;
    this.carrierBarcode = params.carrierBarcode;
    this.labelUrl = params.labelUrl;
  }
}
