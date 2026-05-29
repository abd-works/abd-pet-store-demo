import { toAppointmentId, type AppointmentId } from './AppointmentId';
import { AppointmentStatus, type AppointmentStatusValue } from './AppointmentStatus';
import { TimeSlot, type TimeSlotData } from './TimeSlot';
import type { VisitNote } from './VisitNote';
import type { VisitOutcome } from './VisitOutcome';
import type { StaffVisitNotes } from './StaffVisitNotes';
import type { FollowUpAction } from './FollowUpAction';
import type { FollowUpDate } from './FollowUpDate';
import { CheckInRecord } from './CheckInRecord';
import { NoShowRecord } from './NoShowRecord';
import {
  AppointmentAlreadyCheckedInError,
  AppointmentCancelledError,
  AlreadyCheckedInError,
  OutcomeAlreadyRecordedError,
} from './AppointmentErrors';
import type { PetId } from '../../pet/shared/PetId';

export interface AppointmentSnapshot {
  id: string;
  petId: string;
  storeCode: string;
  customerId: string;
  timeSlot: TimeSlotData & { startAt: string; endAt: string };
  visitNote: string | null;
  status: AppointmentStatusValue;
  checkInRecord: { checkedInBy: string; checkedInAt: string } | null;
  noShowRecord: { recordedBy: string; recordedAt: string } | null;
  visitOutcome: VisitOutcome | null;
  staffVisitNotes: string | null;
  followUpAction: FollowUpAction | null;
  followUpDate: string | null;
  notificationStatus: 'pending' | 'notified' | null;
  reminderSent: boolean;
  canOverrideOutcome: boolean;
  createdAt: string;
}

export interface AppointmentListItemDto {
  id: string;
  petId: string;
  petName: string;
  customerId: string;
  customerName: string;
  timeSlotId: string;
  startAt: Date;
  endAt: Date;
  status: AppointmentStatusValue;
  notificationStatus: 'pending' | 'notified' | null;
}

/** << Entity >> — adoption visit appointment lifecycle (Increment 6). */
export class Appointment {
  readonly id: AppointmentId;
  readonly petId: PetId;
  readonly storeCode: string;
  readonly customerId: string;
  readonly timeSlot: TimeSlot;
  readonly visitNote: VisitNote | null;
  status: AppointmentStatusValue;
  checkInRecord: CheckInRecord | null;
  noShowRecord: NoShowRecord | null;
  visitOutcome: VisitOutcome | null;
  staffVisitNotes: StaffVisitNotes | null;
  followUpAction: FollowUpAction | null;
  followUpDate: FollowUpDate | null;
  notificationStatus: 'pending' | 'notified' | null;
  reminderSent: boolean;
  canOverrideOutcome: boolean;
  readonly createdAt: Date;

  constructor(params: {
    id: AppointmentId;
    petId: PetId;
    storeCode: string;
    customerId: string;
    timeSlot: TimeSlot;
    visitNote: VisitNote | null;
    status: AppointmentStatusValue;
    checkInRecord?: CheckInRecord | null;
    noShowRecord?: NoShowRecord | null;
    visitOutcome?: VisitOutcome | null;
    staffVisitNotes?: StaffVisitNotes | null;
    followUpAction?: FollowUpAction | null;
    followUpDate?: FollowUpDate | null;
    notificationStatus?: 'pending' | 'notified' | null;
    reminderSent?: boolean;
    canOverrideOutcome?: boolean;
    createdAt?: Date;
  }) {
    this.id = params.id;
    this.petId = params.petId;
    this.storeCode = params.storeCode;
    this.customerId = params.customerId;
    this.timeSlot = params.timeSlot;
    this.visitNote = params.visitNote;
    this.status = params.status;
    this.checkInRecord = params.checkInRecord ?? null;
    this.noShowRecord = params.noShowRecord ?? null;
    this.visitOutcome = params.visitOutcome ?? null;
    this.staffVisitNotes = params.staffVisitNotes ?? null;
    this.followUpAction = params.followUpAction ?? null;
    this.followUpDate = params.followUpDate ?? null;
    this.notificationStatus = params.notificationStatus ?? null;
    this.reminderSent = params.reminderSent ?? false;
    this.canOverrideOutcome = params.canOverrideOutcome ?? false;
    this.createdAt = params.createdAt ?? new Date();
  }

  checkIn(staffId: string, at: Date): void {
    if (this.status === AppointmentStatus.CheckedIn) {
      throw new AppointmentAlreadyCheckedInError(this.id, this.checkInRecord?.checkedInAt);
    }
    if (this.status === AppointmentStatus.Cancelled) {
      throw new AppointmentCancelledError(this.id);
    }
    this.checkInRecord = CheckInRecord.create(staffId, at);
    this.status = AppointmentStatus.CheckedIn;
  }

  recordOutcome(outcome: VisitOutcome, notes?: StaffVisitNotes): void {
    if (this.status === AppointmentStatus.OutcomeRecorded && !this.canOverrideOutcome) {
      throw new OutcomeAlreadyRecordedError(this.id);
    }
    this.visitOutcome = outcome;
    this.staffVisitNotes = notes ?? null;
    this.status = AppointmentStatus.OutcomeRecorded;
  }

  recordNoShow(staffId: string, at: Date): void {
    if (this.status === AppointmentStatus.CheckedIn) {
      throw new AlreadyCheckedInError(this.id);
    }
    this.noShowRecord = NoShowRecord.create(staffId, at);
    this.status = AppointmentStatus.NoShow;
  }

  setFollowUp(action: FollowUpAction, date: FollowUpDate): void {
    this.followUpAction = action;
    this.followUpDate = date;
  }

  overrideOutcome(outcome: VisitOutcome, notes: StaffVisitNotes, authorityStaffId: string): void {
    void authorityStaffId;
    this.canOverrideOutcome = true;
    this.recordOutcome(outcome, notes);
  }

  cancel(): void {
    this.status = AppointmentStatus.Cancelled;
  }

  static create(params: {
    petId: PetId;
    storeCode: string;
    customerId: string;
    timeSlot: TimeSlot;
    visitNote?: VisitNote;
  }): Appointment {
    const id = toAppointmentId(`APPT-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);
    return new Appointment({
      id,
      petId: params.petId,
      storeCode: params.storeCode,
      customerId: params.customerId,
      timeSlot: params.timeSlot,
      visitNote: params.visitNote ?? null,
      status: AppointmentStatus.Confirmed,
    });
  }
}
