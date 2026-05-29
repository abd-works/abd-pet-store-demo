/** << ValueObject >> — mobile-displayable QR code for carrier drop-off point scanning. */
export class ReturnQRCode {
  readonly returnReference: string;
  readonly qrData: string;

  constructor(params: { returnReference: string; qrData: string }) {
    this.returnReference = params.returnReference;
    this.qrData = params.qrData;
  }
}
