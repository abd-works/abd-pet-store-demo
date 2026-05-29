import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FONT_WEIGHT_ACTIVE, FONT_WEIGHT_INACTIVE } from '../../../shared/layout-tokens';

const navStyle: React.CSSProperties = {
  display: 'flex',
  gap: 16,
  padding: '12px 16px',
  borderBottom: '1px solid #ddd',
  fontFamily: 'sans-serif',
  fontSize: 14,
};

const linkStyle = (active: boolean): React.CSSProperties => ({
  textDecoration: 'none',
  color: active ? '#111' : '#555',
  fontWeight: active ? FONT_WEIGHT_ACTIVE : FONT_WEIGHT_INACTIVE,
});

export function Increment1Nav() {
  const { pathname } = useLocation();
  const onStores = pathname.startsWith('/store-locator');
  const onCatalog = pathname.startsWith('/product-catalog') || pathname.startsWith('/products/');

  return (
    <header data-testid="increment-1-nav" style={navStyle}>
      <span style={{ fontWeight: FONT_WEIGHT_ACTIVE, marginRight: 8 }}>PawPlace</span>
      <Link to="/store-locator" style={linkStyle(onStores)}>find stores</Link>
      <Link to="/product-catalog" style={linkStyle(onCatalog)}>shop supplies</Link>
    </header>
  );
}
