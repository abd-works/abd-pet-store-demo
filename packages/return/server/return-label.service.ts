import type { Return } from '../shared/Return';
import { ReturnLabel } from '../shared/ReturnLabel';
import { ReturnQRCode } from '../shared/ReturnQRCode';
import type { ILabelProvider } from './return-label.provider';

const RETURNS_CENTRE_ADDRESS = 'PawPlace Returns Centre';

/** Generates return labels and QR codes from a label provider. */
export class ReturnLabelService {
  constructor(private readonly _labelProvider: ILabelProvider) {}

  async generateLabel(returnEntity: Return): Promise<{ label: ReturnLabel; qrCode: ReturnQRCode }> {
    const result = await this._labelProvider.generateLabel(returnEntity);

    const label = new ReturnLabel({
      returnAddress: RETURNS_CENTRE_ADDRESS,
      orderNumber: returnEntity.orderNumber,
      returnReference: returnEntity.returnId,
      carrierBarcode: result.label.toString('base64'),
    });

    const qrCode = new ReturnQRCode({
      returnReference: returnEntity.returnId,
      qrData: result.qrCode,
    });

    return { label, qrCode };
  }
}
