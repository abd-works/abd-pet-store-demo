import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CustomerPage } from '../components/CustomerPage';
import { AccountSettingsLayout } from '../components/AccountSettingsNav';
import { AppointmentListItem } from '../../../appointment/client/AppointmentListItem';
import { fetchMyAppointments, cancelAppointment } from '../../../appointment/client/appointment.api';
import type { AppointmentDto } from '../../../appointment/client/appointment.api';

function isUpcoming(a: AppointmentDto): boolean {
  return a.status === 'confirmed' || a.status === 'checked_in';
}

export function CustomerAppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetchMyAppointments()
      .then(setAppointments)
      .catch(() => setError('Failed to load appointments'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (appointmentId: string) => {
    try {
      await cancelAppointment(appointmentId);
      load();
    } catch {
      setError('Failed to cancel appointment');
    }
  };

  const now = new Date().toISOString();
  const upcoming = appointments.filter(isUpcoming).sort((a, b) => a.startAt.localeCompare(b.startAt));
  const past = appointments.filter((a) => !isUpcoming(a) || a.startAt < now).sort((a, b) => b.startAt.localeCompare(a.startAt));

  return (
    <CustomerPage title="appointments">
      <AccountSettingsLayout>
        <section>
          {loading && <p>Loading…</p>}
          {error && <p role="alert" style={{ color: '#dc2626' }}>{error}</p>}

          {!loading && appointments.length === 0 && (
            <p>No appointments yet — <Link to="/pets">Browse the Pet Gallery</Link></p>
          )}

          {upcoming.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 16, marginBottom: 12 }}>upcoming appointments</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {upcoming.map((a) => (
                  <AppointmentListItem key={a.appointmentId} appointment={a} onCancel={handleCancel} />
                ))}
              </ul>
            </div>
          )}

          {past.length > 0 && (
            <div>
              <h2 style={{ fontSize: 16, marginBottom: 12 }}>past appointments</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {past.map((a) => (
                  <AppointmentListItem key={a.appointmentId} appointment={a} onCancel={handleCancel} />
                ))}
              </ul>
            </div>
          )}
        </section>
      </AccountSettingsLayout>
    </CustomerPage>
  );
}
