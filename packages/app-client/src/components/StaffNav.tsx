import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const STAFF_TABS = [
  { to: '/admin/stock', label: 'Stock Levels' },
  { to: '/staff/appointments', label: 'Incoming Appointments' },
  { to: '/staff/pets', label: 'Pet Profiles' },
  { to: '/staff/returns', label: 'Returns' },
  { to: '/staff/content', label: 'Content' },
] as const;

export function StaffNav() {
  const { pathname } = useLocation();
  return (
    <nav aria-label="staff navigation" style={{ display: 'flex', gap: 2, marginBottom: 24, borderBottom: '1px solid #e5e7eb' }}>
      {STAFF_TABS.map(({ to, label }) => {
        const active = pathname === to || pathname.startsWith(`${to}/`);
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
