import type { Collection } from 'mongodb';
import { Appointment, type AppointmentSnapshot } from '../shared/Appointment';
import { toAppointmentId, type AppointmentId } from '../shared/AppointmentId';
import { TimeSlot } from '../shared/TimeSlot';
import { CheckInRecord } from '../shared/CheckInRecord';
import { NoShowRecord } from '../shared/NoShowRecord';
import { FollowUpDate } from '../shared/FollowUpDate';
import { AppointmentStatus } from '../shared/AppointmentStatus';
import type { VisitNote } from '../shared/VisitNote';
import type { StaffVisitNotes } from '../shared/StaffVisitNotes';
import type { IAppointmentRepository } from './appointment.repository';
import type { PetId } from '../../pet/shared/PetId';

function fromDoc(doc: AppointmentSnapshot): Appointment {
  return new Appointment({
    id: toAppointmentId(doc.id),
    petId: doc.petId as PetId,
    storeCode: doc.storeCode,
    customerId: doc.customerId,
    timeSlot: new TimeSlot({
      timeSlotId: doc.timeSlot.timeSlotId,
      storeCode: doc.timeSlot.storeCode,
      startAt: new Date(doc.timeSlot.startAt),
      endAt: new Date(doc.timeSlot.endAt),
    }),
    visitNote: doc.visitNote as VisitNote | null,
    status: doc.status,
    checkInRecord: doc.checkInRecord
      ? new CheckInRecord({
          checkedInBy: doc.checkInRecord.checkedInBy,
          checkedInAt: new Date(doc.checkInRecord.checkedInAt),
        })
      : null,
    noShowRecord: doc.noShowRecord
      ? new NoShowRecord({
          recordedBy: doc.noShowRecord.recordedBy,
          recordedAt: new Date(doc.noShowRecord.recordedAt),
        })
      : null,
    visitOutcome: doc.visitOutcome,
    staffVisitNotes: doc.staffVisitNotes as StaffVisitNotes | null,
    followUpAction: doc.followUpAction,
    followUpDate: doc.followUpDate ? safeFollowUpDate(doc.followUpDate) : null,
    notificationStatus: doc.notificationStatus,
    reminderSent: doc.reminderSent,
    canOverrideOutcome: doc.canOverrideOutcome,
    createdAt: new Date(doc.createdAt),
  });
}

function safeFollowUpDate(dateStr: string): FollowUpDate | null {
  try {
    return new FollowUpDate(new Date(dateStr));
  } catch {
    return null;
  }
}

function toSnapshot(appointment: Appointment): AppointmentSnapshot {
  return {
    id: appointment.id,
    petId: appointment.petId,
    storeCode: appointment.storeCode,
    customerId: appointment.customerId,
    timeSlot: {
      timeSlotId: appointment.timeSlot.timeSlotId,
      storeCode: appointment.timeSlot.storeCode,
      startAt: appointment.timeSlot.startAt.toISOString(),
      endAt: appointment.timeSlot.endAt.toISOString(),
    },
    visitNote: appointment.visitNote ?? null,
    status: appointment.status,
    checkInRecord: appointment.checkInRecord
      ? {
          checkedInBy: appointment.checkInRecord.checkedInBy,
          checkedInAt: appointment.checkInRecord.checkedInAt.toISOString(),
        }
      : null,
    noShowRecord: appointment.noShowRecord
      ? {
          recordedBy: appointment.noShowRecord.recordedBy,
          recordedAt: appointment.noShowRecord.recordedAt.toISOString(),
        }
      : null,
    visitOutcome: appointment.visitOutcome,
    staffVisitNotes: appointment.staffVisitNotes ?? null,
    followUpAction: appointment.followUpAction,
    followUpDate: appointment.followUpDate?.toDate().toISOString() ?? null,
    notificationStatus: appointment.notificationStatus,
    reminderSent: appointment.reminderSent,
    canOverrideOutcome: appointment.canOverrideOutcome,
    createdAt: appointment.createdAt.toISOString(),
  };
}

export class AppointmentMongoRepository implements IAppointmentRepository {
  constructor(private readonly collection: Collection<AppointmentSnapshot>) {}

  async findById(appointmentId: AppointmentId): Promise<Appointment | null> {
    const doc = await this.collection.findOne({ id: appointmentId });
    if (!doc) return null;
    return fromDoc(doc);
  }

  async findByAccount(customerId: string): Promise<Appointment[]> {
    const docs = await this.collection.find({ customerId }).toArray();
    return docs.map(fromDoc);
  }

  async findConfirmedByStore(storeCode: string): Promise<Appointment[]> {
    const docs = await this.collection
      .find({
        storeCode,
        status: { $in: [AppointmentStatus.Confirmed, AppointmentStatus.CheckedIn] },
      })
      .toArray();
    return docs.map(fromDoc);
  }

  async findConfirmedByPet(petId: PetId): Promise<Appointment[]> {
    const docs = await this.collection
      .find({
        petId,
        status: { $in: [AppointmentStatus.Confirmed, AppointmentStatus.CheckedIn] },
      })
      .toArray();
    return docs.map(fromDoc);
  }

  async findDueForReminder(from: Date, to: Date): Promise<Appointment[]> {
    const docs = await this.collection
      .find({
        'timeSlot.startAt': { $gte: from.toISOString(), $lte: to.toISOString() },
        reminderSent: false,
        status: AppointmentStatus.Confirmed,
      })
      .toArray();
    return docs.map(fromDoc);
  }

  async findDueForFollowUp(today: Date): Promise<Appointment[]> {
    const dayStart = new Date(today);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(today);
    dayEnd.setHours(23, 59, 59, 999);
    const docs = await this.collection
      .find({
        followUpDate: { $gte: dayStart.toISOString(), $lte: dayEnd.toISOString() },
        followUpAction: { $nin: [null, 'none'] },
      })
      .toArray();
    return docs.map(fromDoc);
  }

  async isSlotBooked(timeSlotId: string): Promise<boolean> {
    const count = await this.collection.countDocuments({
      'timeSlot.timeSlotId': timeSlotId,
      status: { $nin: [AppointmentStatus.Cancelled] },
    });
    return count > 0;
  }

  async save(appointment: Appointment): Promise<void> {
    const snapshot = toSnapshot(appointment);
    await this.collection.replaceOne({ id: snapshot.id }, snapshot, { upsert: true });
  }

  async setNotificationStatus(
    appointmentIds: AppointmentId[],
    status: 'pending' | 'notified',
  ): Promise<void> {
    await this.collection.updateMany(
      { id: { $in: appointmentIds } },
      { $set: { notificationStatus: status } },
    );
  }

  async setReminderSent(appointmentId: AppointmentId): Promise<void> {
    await this.collection.updateOne(
      { id: appointmentId },
      { $set: { reminderSent: true } },
    );
  }
}
