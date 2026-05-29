export interface TimeSlotRecord {
  timeslotId: string;
  storeCode: string;
  startTime: string;
  endTime: string;
  bookingStatus: string;
}

export class InMemoryTimeSlotRegistry {
  private slots = new Map<string, TimeSlotRecord>();

  add(slot: TimeSlotRecord): void {
    this.slots.set(slot.timeslotId, slot);
  }

  get(timeslotId: string): TimeSlotRecord | undefined {
    return this.slots.get(timeslotId);
  }

  findAvailableByStore(storeCode: string): TimeSlotRecord[] {
    return [...this.slots.values()].filter(
      (s) => s.storeCode === storeCode && s.bookingStatus === 'available',
    );
  }

  markBooked(timeslotId: string): void {
    const slot = this.slots.get(timeslotId);
    if (slot) slot.bookingStatus = 'booked';
  }

  markAvailable(timeslotId: string): void {
    const slot = this.slots.get(timeslotId);
    if (slot) slot.bookingStatus = 'available';
  }

  deleteMany(ids: string[]): void {
    for (const id of ids) this.slots.delete(id);
  }

  clear(): void {
    this.slots.clear();
  }
}
