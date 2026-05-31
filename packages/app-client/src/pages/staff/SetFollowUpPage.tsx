import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StaffPage } from '../../components/CustomerPage';
import { staffSetFollowUp, fetchStaffAppointments } from '../../../../appointment/client/appointment.api';
import type { StaffAppointmentDto } from '../../../../appointment/client/appointment.api';

const ACTIONS = [
  { value: 'none', label: 'None' },
  { value: 'schedule_return_visit', label: 'Schedule Return Visit' },
  { value: 'hold_pet', label: 'Hold Pet' },
  { value: 'send_adoption_paperwork', label: 'Send Adoption Paperwork' },
] as const;

export function SetFollowUpPage() {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<StaffAppointmentDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState('none');
  const [followUpDate, setFollowUpDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStaffAppointments()
      .then((list) => setAppointment(list.find((a) => a.appointmentId === appointmentId) ?? null))
      .catch(() => setError('Failed to load appointment'))
      .finally(() => setLoading(false));
  }, [appointmentId]);

  const dateRequired = action !== 'none';

  const handleSubmit = async () => {
    if (!appointmentId) return;
    if (dateRequired && !followUpDate) {
      setError('Follow-Up Date is required for this action');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await staffSetFollowUp(appointmentId, action, dateRequired ? followUpDate : undefined);
      navigate('/staff/appointments');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set follow-up');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = async () => {
    if (!appointmentId) return;
    setSubmitting(true);
    try {
      await staffSetFollowUp(appointmentId, 'none');
      navigate('/staff/appointments');
    } catch {
      navigate('/staff/appointments');
    }
  };

  if (loading) return <StaffPage title="set follow-up action"><p>Loading…</p></StaffPage>;

  return (
    <StaffPage title="set follow-up action">
      {appointment && (
        <section aria-label="appointment context" style={{ marginBottom: 20, padding: '12px 16px', background: '#f9fafb', borderRadius: 8 }}>
          <p><strong>customer:</strong> {appointment.customerName}</p>
          <p><strong>pet:</strong> {appointment.petName}</p>
          <p><strong>date and time:</strong> {new Date(appointment.startAt).toLocaleString('en-GB')}</p>
          {appointment.outcome && <p><strong>outcome recorded:</strong> {appointment.outcome}</p>}
        </section>
      )}

      <div style={{ marginBottom: 20 }}>
        <label htmlFor="follow-up-action" style={{ display: 'block', fontWeight: 500, marginBottom: 6 }}>Follow-Up Action</label>
        <select
          id="follow-up-action"
          role="listbox"
          aria-label="Follow-Up Action"
          value={action}
          onChange={(e) => { setAction(e.target.value); setFollowUpDate(''); }}
          style={{ width: '100%', maxWidth: 300, padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }}
        >
          {ACTIONS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {action !== 'none' && (
        <div style={{ marginBottom: 20 }}>
          <label htmlFor="follow-up-date" style={{ display: 'block', fontWeight: 500, marginBottom: 6 }}>
            Follow-Up Date
          </label>
          <input
            id="follow-up-date"
            type="date"
            aria-label="Follow-Up Date"
            aria-required="true"
            value={followUpDate}
            onChange={(e) => setFollowUpDate(e.target.value)}
            style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }}
          />
          {action === 'hold_pet' && followUpDate && (
            <p aria-live="polite" style={{ marginTop: 6, fontSize: 13, color: '#555' }}>
              Hold expires: {new Date(followUpDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}
          {action === 'schedule_return_visit' && appointment && (
            <p style={{ marginTop: 10, fontSize: 13 }}>
              <a
                href={`/pets/${appointment.petId}/book/slots`}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#3b82f6' }}
              >
                Book new appointment for {appointment.customerName} with {appointment.petName}
              </a>
            </p>
          )}
        </div>
      )}

      {error && <p role="alert" style={{ color: '#dc2626', marginBottom: 12 }}>{error}</p>}

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            padding: '10px 20px',
            background: submitting ? '#e5e7eb' : '#3b82f6',
            color: submitting ? '#9ca3af' : '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: submitting ? 'not-allowed' : 'pointer',
            fontWeight: 600,
          }}
        >
          {submitting ? 'Saving…' : 'Set Follow-Up'}
        </button>
        <button
          type="button"
          onClick={handleSkip}
          disabled={submitting}
          style={{ padding: '10px 20px', background: '#fff', border: '1px solid #d1d5db', borderRadius: 6, cursor: 'pointer' }}
        >
          Skip
        </button>
      </div>
    </StaffPage>
  );
}
