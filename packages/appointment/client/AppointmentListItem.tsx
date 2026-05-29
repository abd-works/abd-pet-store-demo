import React from 'react';
import { Link } from 'react-router-dom';
import type { AppointmentDto } from './appointment.api';

interface AppointmentListItemProps {
  appointment: AppointmentDto;
  onCancel: (appointmentId: string) => void;
}

function formatDateTime(startAt: string): string {
  return new Date(startAt).toLocaleString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

const STATUS_LABEL: Record<string, string> = {
  confirmed: 'Confirmed',
  checked_in: 'Checked In',
  outcome_recorded: 'Outcome Recorded',
  no_show: 'No Show',
  cancelled: 'Cancelled',
};

export function AppointmentListItem({ appointment, onCancel }: AppointmentListItemProps) {
  const isUpcoming = appointment.status === 'confirmed' || appointment.status === 'checked_in';
  const isPetAdopted = appointment.petStatus === 'adopted';

  return (
    <li
      aria-label={`${appointment.petName} appointment on ${formatDateTime(appointment.startAt)}`}
      style={{
        display: 'flex',
        gap: 12,
        padding: '12px 16px',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        background: '#fff',
      }}
    >
      {appointment.petPhotoUrl ? (
        <img
          src={appointment.petPhotoUrl}
          alt={appointment.petName}
          loading="lazy"
          style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }}
        />
      ) : (
        <div style={{ width: 56, height: 56, background: '#eee', borderRadius: 6, flexShrink: 0 }} aria-hidden="true" />
      )}
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 600, marginBottom: 2 }}>{appointment.petName}</p>
        <p style={{ fontSize: 13, color: '#555', marginBottom: 2 }}>{appointment.storeName} · {formatDateTime(appointment.startAt)}</p>
        {appointment.visitNote && (
          <p style={{ fontSize: 13, color: '#666', marginBottom: 2 }}>note: {appointment.visitNote}</p>
        )}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 4,
              fontSize: 12,
              background: appointment.status === 'cancelled' ? '#fee2e2' : '#f0fdf4',
              color: appointment.status === 'cancelled' ? '#dc2626' : '#16a34a',
            }}
          >
            {STATUS_LABEL[appointment.status] ?? appointment.status}
          </span>
          {isPetAdopted && isUpcoming && (
            <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 12, background: '#fef3c7', color: '#d97706' }}>
              pet adopted
            </span>
          )}
        </div>
        {isPetAdopted && isUpcoming && (
          <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => onCancel(appointment.appointmentId)}
              style={{ padding: '6px 12px', background: '#fff', border: '1px solid #d1d5db', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}
            >
              Cancel
            </button>
            <Link
              to="/pets"
              style={{ padding: '6px 12px', background: '#f0f9ff', color: '#2563eb', borderRadius: 6, fontSize: 13, textDecoration: 'none' }}
            >
              Browse other pets
            </Link>
          </div>
        )}
      </div>
    </li>
  );
}
