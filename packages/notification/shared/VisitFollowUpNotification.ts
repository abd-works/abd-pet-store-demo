import type { Appointment } from '../../appointment/shared/Appointment';

export class VisitFollowUpNotification {
  readonly to: string;
  readonly subject: string;
  readonly petName: string;
  readonly followUpAction: string;
  readonly appointmentId: string;

  constructor(appointment: Appointment, recipientEmail: string, petName: string) {
    this.to = recipientEmail;
    this.subject = `Follow-up about your visit with ${petName}`;
    this.petName = petName;
    this.followUpAction = appointment.followUpAction ?? 'none';
    this.appointmentId = appointment.id;
  }
}
