import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { StaffAppointmentDto } from './appointment.api';
import { staffCheckIn, staffRecordNoShow } from './appointment.api';

interface StaffAppointmentRowProps {
  appointment: StaffAppointmentDto;
  onRefresh: () => void;
}

function formatDateTime(startAt: string): string {
  return new Date(startAt).toLocaleString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

export function StaffAppointmentRow({ appointment, onRefresh }: StaffAppointmentRowProps) {
  const [inlineAlert, setInlineAlert] = useState<string | null>(null);
  const STAFF_ID = 'staff-current';

  const handleCheckIn = async () => {
    try {
      await staffCheckIn(appointment.appointmentId, STAFF_ID);
      onRefresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Check-in failed';
      if (msg.toLowerCase().includes('already checked')) {
        setInlineAlert(`already checked in — checked in at ${appointment.checkedInAt ?? 'unknown time'}`);
      } else if (msg.toLowerCase().includes('cancelled')) {
        setInlineAlert('this appointment was cancelled — no further action available');
      } else {
        setInlineAlert(msg);
      }
    }
  };

  const handleNoShow = async () => {
    try {
      await staffRecordNoShow(appointment.appointmentId, STAFF_ID);
      onRefresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'No-show recording failed';
      if (msg.toLowerCase().includes('already checked')) {
        setInlineAlert('customer was already checked in — no-show cannot be recorded');
      } else {
        setInlineAlert(msg);
      }
    }
  };

  const isPastDue = new Date(appointment.endAt) < new Date() && appointment.status === 'confirmed';
  const isPetAdopted = appointment.petStatus === 'adopted';

  return (
    <li style={{ padding: '12px 16px', border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', marginBottom: 8 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 600, marginBottom: 2 }}>
            {appointment.customerName} — {appointment.petName}
            {isPetAdopted && (
              <span style={{ marginLeft: 8, padding: '2px 6px', background: '#fef3c7', color: '#d97706', borderRadius: 4, fontSize: 11, fontWeight: 400 }}>
                pet adopted
              </span>
            )}
            {appointment.notificationStatus === 'notified' && (
              <span style={{ marginLeft: 8, padding: '2px 6px', background: '#f0fdf4', color: '#16a34a', borderRadius: 4, fontSize: 11, fontWeight: 400 }}>
                notified
              </span>
            )}
            {appointment.notificationStatus === 'pending' && (
              <span style={{ marginLeft: 8, padding: '2px 6px', background: '#fef9c3', color: '#ca8a04', borderRadius: 4, fontSize: 11, fontWeight: 400 }}>
                not yet notified
              </span>
            )}
          </p>
          <p style={{ fontSize: 13, color: '#555', marginBottom: 2 }}>{formatDateTime(appointment.startAt)}</p>
          {appointment.visitNote && (
            <p style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>note: {appointment.visitNote}</p>
          )}
          {isPastDue && (
            <p style={{ fontSize: 12, color: '#dc2626' }}>no check-in — past due</p>
          )}
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          {appointment.status === 'confirmed' && (
            <button
              type="button"
              onClick={handleCheckIn}
              aria-label={`Check in ${appointment.customerName} for ${appointment.petName} appointment`}
              style={{ padding: '6px 10px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}
            >
              Check In
            </button>
          )}
          {appointment.status === 'checked_in' && (
            <span style={{ padding: '6px 10px', background: '#f0fdf4', color: '#16a34a', borderRadius: 6, fontSize: 12 }}>
              Checked In {appointment.checkedInAt ? `at ${new Date(appointment.checkedInAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}` : ''}
            </span>
          )}
          {(appointment.status === 'confirmed' || appointment.status === 'checked_in') && (
            <Link
              to={`/staff/appointments/${appointment.appointmentId}/outcome`}
              aria-label={`Record outcome for ${appointment.customerName} — ${appointment.petName}`}
              style={{ padding: '6px 10px', background: '#f3f4f6', color: '#374151', borderRadius: 6, fontSize: 12, textDecoration: 'none' }}
            >
              Record Outcome
            </Link>
          )}
          {(appointment.status === 'confirmed' || isPastDue) && (
            <button
              type="button"
              onClick={handleNoShow}
              aria-label={`Mark no-show for ${appointment.customerName} — ${appointment.petName}`}
              style={{ padding: '6px 10px', background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}
            >
              Mark No-Show
            </button>
          )}
        </div>
      </div>
      {inlineAlert && (
        <p
          role="alert"
          style={{ marginTop: 8, padding: '6px 10px', background: '#fef2f2', color: '#dc2626', borderRadius: 6, fontSize: 13 }}
        >
          {inlineAlert}
        </p>
      )}
    </li>
  );
}
