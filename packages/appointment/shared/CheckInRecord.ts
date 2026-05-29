export interface CheckInRecordData {
  checkedInBy: string;
  checkedInAt: Date;
}

export class CheckInRecord {
  readonly checkedInBy: string;
  readonly checkedInAt: Date;

  constructor(data: CheckInRecordData) {
    this.checkedInBy = data.checkedInBy;
    this.checkedInAt = data.checkedInAt;
  }

  static create(staffId: string, at: Date): CheckInRecord {
    return new CheckInRecord({ checkedInBy: staffId, checkedInAt: at });
  }
}
