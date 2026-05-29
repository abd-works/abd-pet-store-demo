import type { CSSProperties } from 'react';

export const storeStockRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr auto',
  gap: 12,
  padding: '10px 0',
  borderBottom: '1px solid #eee',
  fontSize: 14,
  alignItems: 'center',
};

export const stockAvailabilityListStyle: CSSProperties = { listStyle: 'none', padding: 0, margin: 0 };
