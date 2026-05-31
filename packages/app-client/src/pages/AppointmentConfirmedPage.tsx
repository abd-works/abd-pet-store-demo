import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CustomerPage } from '../components/CustomerPage';
import type { AppointmentDto } from '../../../appointment/client/appointment.api';

interface LocationState {
  appointment: AppointmentDto;
}

function formatDateTime(startAt: string, endAt: string): string {
  const start = new Date(startAt);
  const end = new Date(endAt);
  return `${start.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} · ${start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}–${end.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
}

export function AppointmentConfirmedPage() {
  const { state } = useLocation() as { state: LocationState | null };

  if (!state?.appointment) {
    return (
      <CustomerPage title="appointment confirmed">
        <p><Link to="/account/appointments">View my appointments</Link></p>
      </CustomerPage>
    );
  }

  const { appointment } = state;

  return (
    <CustomerPage title="appointment confirmed">
      <p aria-live="polite" style={{ fontSize: 20, fontWeight: 700, color: '#16a34a', marginBottom: 16 }}>
        Appointment confirmed!
      </p>
      <p style={{ fontSize: 14, color: '#555', marginBottom: 20 }}>Booking reference: {appointment.appointmentId}</p>

      <section
        aria-label="booking details"
        style={{ padding: '16px', background: '#f9fafb', borderRadius: 8, marginBottom: 24 }}
      >
        <p><strong>pet:</strong> {appointment.petName}</p>
        <p><strong>store:</strong> {appointment.storeName}</p>
        <p><strong>address:</strong> {appointment.storeAddress}</p>
        <p><strong>date and time:</strong> {formatDateTime(appointment.startAt, appointment.endAt)}</p>
        {appointment.visitNote && (
          <p><strong>visit note:</strong> {appointment.visitNote}</p>
        )}
        <p style={{ marginTop: 8, fontSize: 13, color: '#555' }}>
          Appointment Confirmation Email sent to your account email address
        </p>
      </section>

      <div style={{ display: 'flex', gap: 8 }}>
        <Link
          to="/account/appointments"
          style={{ padding: '10px 20px', background: '#3b82f6', color: '#fff', borderRadius: 6, textDecoration: 'none', fontWeight: 600 }}
        >
          View My Appointments
        </Link>
        <Link
          to="/pets"
          style={{ padding: '10px 20px', background: '#fff', border: '1px solid #d1d5db', color: '#333', borderRadius: 6, textDecoration: 'none' }}
        >
          Browse More Pets
        </Link>
      </div>
    </CustomerPage>
  );
}
