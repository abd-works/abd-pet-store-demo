import React from 'react';
import { CustomerNav } from './CustomerNav';

interface Increment1PageProps {
  title: string;
  children: React.ReactNode;
}

export function Increment1Page({ title, children }: Increment1PageProps) {
  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#fafafa' }}>
      <CustomerNav />
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px' }}>
        <h1 style={{ fontSize: 22, marginBottom: 16 }}>{title}</h1>
        {children}
      </main>
    </div>
  );
}
