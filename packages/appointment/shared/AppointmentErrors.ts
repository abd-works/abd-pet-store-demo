export class SlotNoLongerAvailableError extends Error {
  constructor(timeSlotId: string) {
    super(`Time slot is no longer available: ${timeSlotId}`);
    this.name = 'SlotNoLongerAvailableError';
  }
}

export class SlotHoldExpiredError extends Error {
  constructor(holdId: string) {
    super(`Slot hold expired — please re-select a time slot: ${holdId}`);
    this.name = 'SlotHoldExpiredError';
  }
}

export class AppointmentNotFoundError extends Error {
  constructor(appointmentId: string) {
    super(`Appointment not found: ${appointmentId}`);
    this.name = 'AppointmentNotFoundError';
  }
}

export class AppointmentAlreadyCheckedInError extends Error {
  readonly originalCheckedInAt?: Date;

  constructor(appointmentId: string, checkedInAt?: Date) {
    super(`Appointment ${appointmentId} is already checked in`);
    this.name = 'AppointmentAlreadyCheckedInError';
    this.originalCheckedInAt = checkedInAt;
  }
}

export class AppointmentCancelledError extends Error {
  constructor(appointmentId: string) {
    super(`Appointment ${appointmentId} is cancelled`);
    this.name = 'AppointmentCancelledError';
  }
}

export class AlreadyCheckedInError extends Error {
  constructor(appointmentId: string) {
    super(`Cannot record no-show: appointment ${appointmentId} is already checked in`);
    this.name = 'AlreadyCheckedInError';
  }
}

export class OutcomeAlreadyRecordedError extends Error {
  constructor(appointmentId: string) {
    super(`Outcome already recorded for appointment ${appointmentId}`);
    this.name = 'OutcomeAlreadyRecordedError';
  }
}
