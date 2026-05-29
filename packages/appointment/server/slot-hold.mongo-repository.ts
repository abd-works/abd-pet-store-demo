import type { Collection } from 'mongodb';
import { SlotHold, type SlotHoldSnapshot } from '../shared/SlotHold';
import type { ISlotHoldRepository } from './appointment.repository';

export class SlotHoldMongoRepository implements ISlotHoldRepository {
  constructor(private readonly collection: Collection<SlotHoldSnapshot>) {}

  async findActiveHold(timeSlotId: string): Promise<SlotHold | null> {
    const now = new Date();
    const doc = await this.collection.findOne({
      timeSlotId,
      expiresAt: { $gt: now },
    });
    if (!doc) return null;
    return new SlotHold(doc);
  }

  async findById(holdId: string): Promise<SlotHold | null> {
    const doc = await this.collection.findOne({ holdId });
    if (!doc) return null;
    return new SlotHold(doc);
  }

  async insert(hold: SlotHold): Promise<void> {
    await this.collection.insertOne(hold.toSnapshot());
  }

  async delete(holdId: string): Promise<void> {
    await this.collection.deleteOne({ holdId });
  }
}
