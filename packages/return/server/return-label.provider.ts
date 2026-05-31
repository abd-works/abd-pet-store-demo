import type { Return } from '../shared/Return';

export interface ILabelProvider {
  generateLabel(returnEntity: Return): Promise<{ label: Buffer; qrCode: string }>;
}

/** Test/dev stub — returns a minimal label payload without external carrier integration. */
export class StubLabelProvider implements ILabelProvider {
  async generateLabel(returnEntity: Return): Promise<{ label: Buffer; qrCode: string }> {
    return {
      label: Buffer.from(`stub-label-${returnEntity.returnId}`),
      qrCode: `QR-${returnEntity.returnId}`,
    };
  }
}
