import type { Return } from '../shared/Return';

export interface ILabelProvider {
  generateLabel(returnEntity: Return): Promise<{ label: Buffer; qrCode: string }>;
}
