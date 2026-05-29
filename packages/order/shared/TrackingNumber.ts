export const DEFAULT_CARRIER_NAME = 'Royal Mail';

export const FULFILL_WITHOUT_TRACKING_WARNING =
  'Customer will not receive a shipping notification';

export class InvalidTrackingNumberError extends Error {
  constructor() {
    super('Invalid tracking number');
    this.name = 'InvalidTrackingNumberError';
  }
}

export interface TrackingNumberSnapshot {
  value: string;
  carrierName: string;
}

export class TrackingNumber {
  readonly value: string;
  readonly carrierName: string;

  constructor(value: string, carrierName: string) {
    this.value = value;
    this.carrierName = carrierName;
  }

  static create(input: { number: string; carrierName: string }): TrackingNumber {
    if (!input.number.trim()) throw new InvalidTrackingNumberError();
    return new TrackingNumber(
      input.number.trim(),
      input.carrierName.trim() || DEFAULT_CARRIER_NAME,
    );
  }

  toJSON(): TrackingNumberSnapshot {
    return { value: this.value, carrierName: this.carrierName };
  }

  carrierTrackingUrl(): string {
    if (this.carrierName.toLowerCase().includes('royal mail')) {
      return `https://www.royalmail.com/track-your-item#/tracking-results/${encodeURIComponent(this.value)}`;
    }
    return `https://track.example.com/${encodeURIComponent(this.value)}`;
  }
}
