import React from 'react';
import type { TimeSlotDto } from './appointment.api';

interface AppointmentCalendarProps {
  slots: TimeSlotDto[];
  selectedSlotId: string | null;
  holdExpired: boolean;
  onSelect: (slot: TimeSlotDto) => void;
}

function formatSlot(startAt: string, endAt: string): string {
  const start = new Date(startAt);
  const end = new Date(endAt);
  const dateStr = start.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  const timeStr = `${start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} – ${end.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
  return `${dateStr} · ${timeStr}`;
}

export function AppointmentCalendar({ slots, selectedSlotId, holdExpired, onSelect }: AppointmentCalendarProps) {
  if (slots.length === 0) {
    return (
      <p aria-live="polite" style={{ color: '#555', marginTop: 16 }}>
        no slots available — try a later date
      </p>
    );
  }

  return (
    <div>
      {holdExpired && (
        <p
          role="alert"
          style={{ color: '#dc2626', marginBottom: 12, padding: '8px 12px', background: '#fef2f2', borderRadius: 6 }}
        >
          your selected slot is no longer held — please select a new time
        </p>
      )}
      <ul
        role="listbox"
        aria-label="Available time slots"
        style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}
      >
        {slots.map((slot) => {
          const selected = slot.timeSlotId === selectedSlotId;
          return (
            <li key={slot.timeSlotId}>
              <button
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => onSelect(slot)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 14px',
                  border: selected ? '2px solid #3b82f6' : '1px solid #ddd',
                  borderRadius: 6,
                  cursor: 'pointer',
                  background: selected ? '#eff6ff' : '#fff',
                  fontWeight: selected ? 600 : 400,
                  color: selected ? '#1d4ed8' : '#333',
                  fontSize: 14,
                }}
              >
                {formatSlot(slot.startAt, slot.endAt)}
              </button>
            </li>
          );
        })}
      </ul>
      {selectedSlotId && !holdExpired && (
        <p aria-live="polite" style={{ marginTop: 10, fontSize: 13, color: '#555' }}>
          slot held for 10 minutes — complete booking to confirm
        </p>
      )}
    </div>
  );
}
