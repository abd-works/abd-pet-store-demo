export interface NoShowRecordData {
  recordedBy: string;
  recordedAt: Date;
}

export class NoShowRecord {
  readonly recordedBy: string;
  readonly recordedAt: Date;

  constructor(data: NoShowRecordData) {
    this.recordedBy = data.recordedBy;
    this.recordedAt = data.recordedAt;
  }

  static create(staffId: string, at: Date): NoShowRecord {
    return new NoShowRecord({ recordedBy: staffId, recordedAt: at });
  }
}
