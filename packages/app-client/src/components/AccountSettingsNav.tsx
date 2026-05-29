import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const linkStyle = (active: boolean): React.CSSProperties => ({
  display: 'block',
  padding: '8px 12px',
  textDecoration: 'none',
  color: active ? '#111' : '#555',
  fontWeight: active ? 600 : 400,
  background: active ? '#eee' : 'transparent',
  borderRadius: 4,
});

export function AccountSettingsNav() {
  const { pathname } = useLocation();
  const items = [
    { to: '/account', label: 'overview' },
    { to: '/account/addresses', label: 'address book' },
    { to: '/account/payment-methods', label: 'saved payment methods' },
    { to: '/account/orders', label: 'order history' },
    { to: '/account/appointments', label: 'appointments' },
  ];

  return (
    <nav aria-label="account settings nav" style={{ minWidth: 200 }}>
      <div>
        {items.map((item) => (
          <div key={item.to} style={{ marginBottom: 4 }}>
            <Link
              to={item.to}
              style={linkStyle(pathname === item.to || (item.to !== '/account' && pathname.startsWith(item.to)))}
            >
              {item.label}{pathname === item.to ? ' (active)' : ''}
            </Link>
          </div>
        ))}
      </div>
    </nav>
  );
}

export function AccountSettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24 }}>
      <AccountSettingsNav />
      <div>{children}</div>
    </div>
  );
}
