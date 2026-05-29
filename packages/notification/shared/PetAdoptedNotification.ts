import type { Appointment } from '../../appointment/shared/Appointment';

export class PetAdoptedNotification {
  readonly to: string;
  readonly subject: string;
  readonly petName: string;
  readonly appointmentId: string;
  readonly cancelUrl: string;
  readonly browseUrl: string;

  constructor(appointment: Appointment, recipientEmail: string, petName: string) {
    this.to = recipientEmail;
    this.subject = `Update about your visit — ${petName} has been adopted`;
    this.petName = petName;
    this.appointmentId = appointment.id;
    this.cancelUrl = `/appointments/${appointment.id}/cancel`;
    this.browseUrl = '/pets';
  }
}
