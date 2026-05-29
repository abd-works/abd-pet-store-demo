import type { Appointment } from '../../appointment/shared/Appointment';

export class AppointmentReminderEmail {
  readonly to: string;
  readonly subject: string;
  readonly petName: string;
  readonly storeName: string;
  readonly startAt: Date;
  readonly endAt: Date;
  readonly visitNote: string | null;
  readonly appointmentId: string;

  constructor(appointment: Appointment, recipientEmail: string, petName: string, storeName: string) {
    this.to = recipientEmail;
    this.subject = `Reminder: your visit with ${petName} is tomorrow`;
    this.petName = petName;
    this.storeName = storeName;
    this.startAt = appointment.timeSlot.startAt;
    this.endAt = appointment.timeSlot.endAt;
    this.visitNote = appointment.visitNote;
    this.appointmentId = appointment.id;
  }
}
