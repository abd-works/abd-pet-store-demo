declare const __appointmentId: unique symbol;

export type AppointmentId = string & { readonly [__appointmentId]: true };

export function toAppointmentId(value: string): AppointmentId {
  if (!value.trim()) throw new Error('AppointmentId must not be blank');
  return value as AppointmentId;
}
