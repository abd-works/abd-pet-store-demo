import type { PetId } from '../../pet/shared/PetId';

export interface SlotHoldSnapshot {
  holdId: string;
  customerId: string;
  petId: string;
  timeSlotId: string;
  expiresAt: Date;
}

export interface SlotHoldDto {
  holdId: string;
  expiresAt: Date;
}

export class SlotHold {
  readonly holdId: string;
  readonly customerId: string;
  readonly petId: PetId;
  readonly timeSlotId: string;
  readonly expiresAt: Date;

  constructor(snapshot: SlotHoldSnapshot) {
    this.holdId = snapshot.holdId;
    this.customerId = snapshot.customerId;
    this.petId = snapshot.petId as PetId;
    this.timeSlotId = snapshot.timeSlotId;
    this.expiresAt = snapshot.expiresAt;
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  toDto(): SlotHoldDto {
    return { holdId: this.holdId, expiresAt: this.expiresAt };
  }

  static create(params: {
    petId: PetId;
    timeSlotId: string;
    customerId: string;
    holdMinutes: number;
  }): SlotHold {
    const expiresAt = new Date(Date.now() + params.holdMinutes * 60 * 1000);
    return new SlotHold({
      holdId: `HOLD-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      customerId: params.customerId,
      petId: params.petId,
      timeSlotId: params.timeSlotId,
      expiresAt,
    });
  }

  toSnapshot(): SlotHoldSnapshot {
    return {
      holdId: this.holdId,
      customerId: this.customerId,
      petId: this.petId,
      timeSlotId: this.timeSlotId,
      expiresAt: this.expiresAt,
    };
  }
}
