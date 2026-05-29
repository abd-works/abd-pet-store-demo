import type { IAppointmentRepository } from '../../appointment/server/appointment.repository';
import type { AppointmentNotificationService } from './appointment-notification.service';
import { AppointmentStatus } from '../../appointment/shared/AppointmentStatus';

export class AppointmentReminderJob {
  constructor(
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly notificationService: AppointmentNotificationService,
  ) {}

  async run(): Promise<void> {
    const now = new Date();
    const windowEnd = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const appointments = await this.appointmentRepository.findDueForReminder(now, windowEnd);

    for (const appointment of appointments) {
      if (
        appointment.status === AppointmentStatus.Cancelled ||
        appointment.status === AppointmentStatus.NoShow
      ) {
        continue;
      }
      if (appointment.notificationStatus === 'notified') {
        // Pet adopted — adoption notification takes precedence; skip reminder
        continue;
      }
      await this.notificationService.sendReminder(appointment);
    }
  }
}
