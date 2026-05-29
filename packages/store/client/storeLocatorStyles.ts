import type { CSSProperties } from 'react';

export const formRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  alignItems: 'center',
  marginBottom: 12,
};

export const splitStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 24,
  minHeight: 420,
};

export const panelStyle: CSSProperties = {
  background: '#fff',
  border: '1px solid #ddd',
  borderRadius: 4,
  padding: 16,
};

export const storeDetailHeaderStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: 12,
};

export const storeDetailTitleStyle: CSSProperties = { fontSize: 16, margin: 0 };

export const storeDetailListStyle: CSSProperties = { margin: 0, fontSize: 14, lineHeight: 1.6 };

export const storeDetailTermStyle: CSSProperties = { fontWeight: 600 };

export const storeDetailValueStyle: CSSProperties = { margin: '0 0 8px' };

export const storeDetailDistanceStyle: CSSProperties = { margin: 0 };

export const storePlaceholderStyle: CSSProperties = {
  background: '#fff',
  border: '1px dashed #ccc',
  borderRadius: 4,
  padding: 24,
  color: '#888',
  fontSize: 14,
};

export const storeListStyle: CSSProperties = { listStyle: 'none', padding: 0, margin: 0 };

export const storeListHeadingStyle: CSSProperties = { fontSize: 14, marginTop: 0 };

export const storeLoadingStyle: CSSProperties = { color: '#888' };

export function storeListEntryStyle(selected: boolean): CSSProperties {
  return {
    padding: '12px 0',
    borderBottom: '1px solid #eee',
    background: selected ? '#f5f9ff' : undefined,
  };
}

export const storeListEntryTextStyle: CSSProperties = { fontSize: 14 };

export const storeListAddressStyle: CSSProperties = { color: '#555', marginTop: 4 };

export const storeListDistanceStyle: CSSProperties = { marginTop: 4 };

export const storeListSelectStyle: CSSProperties = { marginTop: 8 };

export const storeMapTableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 14,
};

export const storeMapHeaderRowStyle: CSSProperties = {
  borderBottom: '1px solid #eee',
  textAlign: 'left',
};

export function storeMapRowStyle(selected: boolean): CSSProperties {
  return {
    borderBottom: '1px solid #f0f0f0',
    background: selected ? '#f5f9ff' : undefined,
  };
}

export const postcodeLabelStyle: CSSProperties = { fontSize: 14 };

export const postcodeInputStyle: CSSProperties = { marginLeft: 8, padding: '4px 8px' };

export const distanceOutputStyle: CSSProperties = { fontSize: 14, color: '#444' };
