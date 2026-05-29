export interface TimeSlotDto {
  timeSlotId: string;
  startAt: string;
  endAt: string;
}

export interface SlotHoldResponseDto {
  holdId: string;
  expiresAt: string;
}

export interface AppointmentDto {
  appointmentId: string;
  petId: string;
  petName: string;
  petPhotoUrl: string | null;
  petStatus: 'available' | 'adopted';
  storeName: string;
  storeAddress: string;
  timeSlotId: string;
  startAt: string;
  endAt: string;
  visitNote: string | null;
  status: 'confirmed' | 'checked_in' | 'outcome_recorded' | 'no_show' | 'cancelled';
  notificationStatus: 'pending' | 'notified' | null;
  outcome: string | null;
}

export interface StaffAppointmentDto extends AppointmentDto {
  customerName: string;
  checkedInAt: string | null;
  noShowAt: string | null;
}

export async function fetchAvailableSlots(petId: string): Promise<TimeSlotDto[]> {
  const res = await fetch(`/api/pets/${petId}/slots`);
  if (!res.ok) throw new Error('Failed to fetch available slots');
  return res.json() as Promise<TimeSlotDto[]>;
}

export async function createHold(petId: string, timeSlotId: string): Promise<SlotHoldResponseDto> {
  const res = await fetch('/api/appointments/hold', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ petId, timeSlotId }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error ?? 'Slot no longer available');
  }
  return res.json() as Promise<SlotHoldResponseDto>;
}

export async function releaseHold(holdId: string): Promise<void> {
  await fetch(`/api/appointments/hold/${holdId}`, { method: 'DELETE' });
}

export async function confirmBooking(
  holdId: string,
  visitNote?: string,
): Promise<AppointmentDto> {
  const res = await fetch('/api/appointments/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ holdId, visitNote }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error ?? 'Booking failed');
  }
  return res.json() as Promise<AppointmentDto>;
}

export async function fetchMyAppointments(): Promise<AppointmentDto[]> {
  const res = await fetch('/api/appointments/mine');
  if (!res.ok) throw new Error('Failed to fetch appointments');
  return res.json() as Promise<AppointmentDto[]>;
}

export async function cancelAppointment(appointmentId: string): Promise<void> {
  const res = await fetch(`/api/appointments/${appointmentId}/cancel`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to cancel appointment');
}

export async function fetchStaffAppointments(): Promise<StaffAppointmentDto[]> {
  const res = await fetch('/api/staff/appointments');
  if (!res.ok) throw new Error('Failed to fetch staff appointments');
  return res.json() as Promise<StaffAppointmentDto[]>;
}

export async function staffCheckIn(appointmentId: string, staffId: string): Promise<void> {
  const res = await fetch(`/api/staff/appointments/${appointmentId}/check-in`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ staffId }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error ?? 'Check-in failed');
  }
}

export async function staffRecordNoShow(appointmentId: string, staffId: string): Promise<void> {
  const res = await fetch(`/api/staff/appointments/${appointmentId}/no-show`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ staffId }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error ?? 'No-show recording failed');
  }
}

export async function staffRecordOutcome(
  appointmentId: string,
  outcome: string,
  staffVisitNotes?: string,
): Promise<void> {
  const res = await fetch(`/api/staff/appointments/${appointmentId}/outcome`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ outcome, staffVisitNotes }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error ?? 'Outcome recording failed');
  }
}

export async function staffSetFollowUp(
  appointmentId: string,
  action: string,
  followUpDate?: string,
): Promise<void> {
  const res = await fetch(`/api/staff/appointments/${appointmentId}/follow-up`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, followUpDate }),
  });
  if (!res.ok) throw new Error('Failed to set follow-up');
}
