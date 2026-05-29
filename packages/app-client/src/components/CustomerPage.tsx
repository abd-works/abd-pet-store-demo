import React from 'react';
import { CustomerNav } from './CustomerNav';

interface CustomerPageProps {
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}

export function CustomerPage({ title, children, wide = false }: CustomerPageProps) {
  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#fafafa' }}>
      <CustomerNav />
      <main style={{ maxWidth: wide ? 1100 : 960, margin: '0 auto', padding: '24px 16px' }}>
        <h1 style={{ fontSize: 22, marginBottom: 16 }}>{title}</h1>
        {children}
      </main>
    </div>
  );
}

export function StaffHeader() {
  return (
    <header
      data-testid="staff-header"
      style={{
        background: '#333',
        color: '#fff',
        padding: '12px 16px',
        fontFamily: 'sans-serif',
        fontSize: 14,
      }}
    >
      PawPlace staff — click-and-collect
    </header>
  );
}

export function StaffPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#fafafa' }}>
      <StaffHeader />
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px' }}>
        <h1 style={{ fontSize: 22, marginBottom: 16 }}>{title}</h1>
        {children}
      </main>
    </div>
  );
}
