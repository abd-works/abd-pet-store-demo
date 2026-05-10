import React from 'react';
import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <main style={{ fontFamily: 'sans-serif', maxWidth: 640, margin: '60px auto', padding: '0 24px' }}>
      <h1>PawPlace</h1>
      <p style={{ color: '#666' }}>Pet supply stores across the UK.</p>

      <nav style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Link to="/store-locator">Store Locator</Link>
        <Link to="/products/PET-HAR-001">Product: Premium Dog Harness</Link>
        <Link to="/products/PET-FLT-099">Product: Salmon Cat Treats</Link>
        <Link to="/admin/stock/PET-HAR-001/STR-001">Admin: Stock Management</Link>
      </nav>
    </main>
  );
}
