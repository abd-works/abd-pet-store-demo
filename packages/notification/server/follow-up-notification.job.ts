import type { IAppointmentRepository } from '../../appointment/server/appointment.repository';
import type { AppointmentNotificationService } from './appointment-notification.service';
import { FollowUpActionValues } from '../../appointment/shared/FollowUpAction';

export class FollowUpNotificationJob {
  constructor(
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly notificationService: AppointmentNotificationService,
  ) {}

  async run(): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointments = await this.appointmentRepository.findDueForFollowUp(today);

    for (const appointment of appointments) {
      if (
        !appointment.followUpAction ||
        appointment.followUpAction === FollowUpActionValues.None
      ) {
        continue;
      }
      if (appointment.notificationStatus === 'notified') {
        // Pet adopted — skip follow-up
        continue;
      }
      await this.notificationService.sendFollowUpNotification(appointment);
    }
  }
}
