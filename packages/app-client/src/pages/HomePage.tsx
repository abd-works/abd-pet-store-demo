import React from 'react';
import { Link } from 'react-router-dom';

function HomeNavLinks() {
  return (
    <nav
      aria-label="Increment 1 prototype paths"
      style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}
    >
      <Link to="/store-locator">store locator — map view / list view</Link>
      <Link to="/product-catalog">product catalog</Link>
      <Link to="/products/PET-HAR-001">product page — Premium Dog Harness</Link>
      <Link to="/products/PET-FLT-099">product page — Salmon Cat Treats</Link>
      <Link to="/admin/stock">admin dashboard — stock levels</Link>
    </nav>
  );
}

export function HomePage() {
  return (
    <main style={{ fontFamily: 'sans-serif', maxWidth: 640, margin: '60px auto', padding: '0 24px' }}>
      <h1>PawPlace</h1>
      <p style={{ color: '#666' }}>
        Increment 1 — walk-in driver (store locator · product catalog · stock availability · admin stock
        form). No cart, checkout, payment, or accounts.
      </p>
      <HomeNavLinks />
    </main>
  );
}
