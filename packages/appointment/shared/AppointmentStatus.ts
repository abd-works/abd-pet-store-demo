export const AppointmentStatus = {
  Confirmed: 'confirmed',
  CheckedIn: 'checked_in',
  OutcomeRecorded: 'outcome_recorded',
  NoShow: 'no_show',
  Cancelled: 'cancelled',
} as const;

export type AppointmentStatusValue = (typeof AppointmentStatus)[keyof typeof AppointmentStatus];
