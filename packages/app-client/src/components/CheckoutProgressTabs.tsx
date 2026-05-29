import React from 'react';

import { Link, useLocation } from 'react-router-dom';

import { loadCheckoutDraft, resolveCheckoutPath } from '../checkout/checkoutDraft';

const tabStyle = (active: boolean, disabled: boolean): React.CSSProperties => ({
  padding: '8px 12px',
  textDecoration: 'none',
  color: disabled ? '#bbb' : active ? '#111' : '#666',
  borderBottom: active ? '2px solid #111' : '2px solid transparent',
  fontSize: 13,
  pointerEvents: disabled ? 'none' : 'auto',
});

interface TabDef {
  label: string;
  path: string;
  key: string;
}

const TAB_BY_KEY: Record<string, TabDef> = {
  cart: { label: 'shopping cart', path: '/cart', key: 'cart' },
  billing: { label: 'billing address', path: '/checkout/billing', key: 'billing' },
  shipping: { label: 'shipping address', path: '/checkout/shipping', key: 'shipping' },
  'delivery-option': { label: 'delivery option', path: '/checkout/delivery-option', key: 'delivery-option' },
  'pickup-store': { label: 'pickup store', path: '/checkout/pickup-store', key: 'pickup-store' },
  payment: { label: 'payment', path: '/checkout/payment', key: 'payment' },
};

function tabsForPath(path: ReturnType<typeof resolveCheckoutPath>): { tab: TabDef; disabled: boolean }[] {
  const keys =
    path === 'standard_delivery'
      ? ['cart', 'billing', 'shipping', 'delivery-option', 'payment']
      : path === 'click_and_collect'
        ? ['cart', 'delivery-option', 'billing', 'pickup-store', 'payment']
        : ['cart', 'pickup-store', 'billing', 'payment'];

  return keys.map((key) => ({ tab: TAB_BY_KEY[key], disabled: false }));
}

export function CheckoutProgressTabs() {
  const { pathname } = useLocation();
  const path = resolveCheckoutPath(loadCheckoutDraft());
  const tabs = tabsForPath(path);

  return (
    <nav
      aria-label="checkout progress"
      style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid #eee', flexWrap: 'wrap' }}
    >
      {tabs.map(({ tab, disabled }) => (
        <Link
          key={tab.path}
          to={tab.path}
          aria-disabled={disabled}
          style={tabStyle(pathname === tab.path, disabled)}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
