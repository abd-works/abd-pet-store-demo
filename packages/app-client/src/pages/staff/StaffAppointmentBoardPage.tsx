import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { StaffPage } from '../../components/CustomerPage';
import { StaffAppointmentRow } from '../../../../appointment/client/StaffAppointmentRow';
import { fetchStaffAppointments } from '../../../../appointment/client/appointment.api';
import type { StaffAppointmentDto } from '../../../../appointment/client/appointment.api';

function StaffNav() {
  const { pathname } = useLocation();
  const tabs = [
    { to: '/admin/stock', label: 'Stock Levels' },
    { to: '/staff/appointments', label: 'Incoming Appointments' },
    { to: '/staff/pets', label: 'Pet Profiles' },
  ];
  return (
    <nav aria-label="staff navigation" style={{ display: 'flex', gap: 2, marginBottom: 24, borderBottom: '1px solid #e5e7eb' }}>
      {tabs.map(({ to, label }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            aria-current={active ? 'page' : undefined}
            style={{
              padding: '10px 16px',
              textDecoration: 'none',
              fontSize: 14,
              color: active ? '#1d4ed8' : '#555',
              borderBottom: active ? '2px solid #3b82f6' : '2px solid transparent',
              fontWeight: active ? 600 : 400,
            }}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function StaffAppointmentBoardPage() {
  const [appointments, setAppointments] = useState<StaffAppointmentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetchStaffAppointments()
      .then((data) => setAppointments(data.sort((a, b) => a.startAt.localeCompare(b.startAt))))
      .catch(() => setError('Failed to load appointments'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <StaffPage title="incoming appointments">
      <StaffNav />
      {loading && <p>Loading…</p>}
      {error && <p role="alert" style={{ color: '#dc2626' }}>{error}</p>}
      {!loading && !error && appointments.length === 0 && (
        <p>No upcoming appointments</p>
      )}
      {appointments.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {appointments.map((a) => (
            <StaffAppointmentRow key={a.appointmentId} appointment={a} onRefresh={load} />
          ))}
        </ul>
      )}
    </StaffPage>
  );
}
