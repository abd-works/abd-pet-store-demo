import type { Appointment } from '../../appointment/shared/Appointment';
import type { IAppointmentRepository } from '../../appointment/server/appointment.repository';
import type { PetId } from '../../pet/shared/PetId';
import { AppointmentConfirmationEmail } from '../shared/AppointmentConfirmationEmail';
import { AppointmentReminderEmail } from '../shared/AppointmentReminderEmail';
import { PetAdoptedNotification } from '../shared/PetAdoptedNotification';
import { VisitFollowUpNotification } from '../shared/VisitFollowUpNotification';
import type { AppointmentId } from '../../appointment/shared/AppointmentId';

export interface EmailProvider {
  enqueue(email: object): Promise<void>;
}

export interface CustomerEmailResolver {
  getEmail(customerId: string): Promise<string>;
  getPetName(petId: string): Promise<string>;
  getStoreName(storeCode: string): string;
}

export class AppointmentNotificationService {
  constructor(
    private readonly emailProvider: EmailProvider,
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly resolver: CustomerEmailResolver,
  ) {}

  async sendConfirmationEmail(appointment: Appointment): Promise<void> {
    const [recipientEmail, petName] = await Promise.all([
      this.resolver.getEmail(appointment.customerId),
      this.resolver.getPetName(appointment.petId),
    ]);
    const storeName = this.resolver.getStoreName(appointment.storeCode);
    await this.emailProvider.enqueue(
      new AppointmentConfirmationEmail(appointment, recipientEmail, petName, storeName),
    );
  }

  async sendReminder(appointment: Appointment): Promise<void> {
    const [recipientEmail, petName] = await Promise.all([
      this.resolver.getEmail(appointment.customerId),
      this.resolver.getPetName(appointment.petId),
    ]);
    const storeName = this.resolver.getStoreName(appointment.storeCode);
    await this.emailProvider.enqueue(
      new AppointmentReminderEmail(appointment, recipientEmail, petName, storeName),
    );
    await this.appointmentRepository.setReminderSent(appointment.id);
  }

  async notifyPendingAppointmentsOfAdoption(petId: PetId): Promise<void> {
    const pending = await this.appointmentRepository.findConfirmedByPet(petId);
    await Promise.all(
      pending.map(async (appointment) => {
        const [recipientEmail, petName] = await Promise.all([
          this.resolver.getEmail(appointment.customerId),
          this.resolver.getPetName(appointment.petId),
        ]);
        await this.emailProvider.enqueue(new PetAdoptedNotification(appointment, recipientEmail, petName));
      }),
    );
    await this.appointmentRepository.setNotificationStatus(
      pending.map((a) => a.id as AppointmentId),
      'notified',
    );
  }

  async sendFollowUpNotification(appointment: Appointment): Promise<void> {
    const [recipientEmail, petName] = await Promise.all([
      this.resolver.getEmail(appointment.customerId),
      this.resolver.getPetName(appointment.petId),
    ]);
    await this.emailProvider.enqueue(new VisitFollowUpNotification(appointment, recipientEmail, petName));
  }
}
