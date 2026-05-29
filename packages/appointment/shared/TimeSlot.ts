export interface TimeSlotData {
  timeSlotId: string;
  storeCode: string;
  startAt: Date;
  endAt: Date;
}

export class TimeSlot {
  readonly timeSlotId: string;
  readonly storeCode: string;
  readonly startAt: Date;
  readonly endAt: Date;

  constructor(data: TimeSlotData) {
    if (data.endAt <= data.startAt) {
      throw new Error('TimeSlot endAt must be after startAt');
    }
    this.timeSlotId = data.timeSlotId;
    this.storeCode = data.storeCode;
    this.startAt = data.startAt;
    this.endAt = data.endAt;
  }

  conflictsWith(other: TimeSlot): boolean {
    return this.storeCode === other.storeCode &&
      this.startAt < other.endAt &&
      this.endAt > other.startAt;
  }
}
