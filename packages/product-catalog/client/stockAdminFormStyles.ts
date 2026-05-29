import type { CSSProperties } from 'react';
import { FORM_MAX_WIDTH_PX } from '../../shared/layout-tokens';

export const stockAdminHeaderStyle: CSSProperties = {
  background: '#2c3e50',
  color: '#fff',
  padding: '12px 16px',
  margin: '-24px -16px 24px',
  borderRadius: '4px 4px 0 0',
  fontSize: 14,
};

export const stockAdminSelectStyle: CSSProperties = {
  display: 'block',
  width: '100%',
  marginTop: 4,
  padding: 8,
};

export const stockAdminInputStyle: CSSProperties = {
  display: 'block',
  width: '100%',
  marginTop: 4,
  padding: 8,
};

export const stockAdminSummaryStyle: CSSProperties = { fontSize: 13, color: '#555' };

export const stockAdminFormStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  maxWidth: FORM_MAX_WIDTH_PX,
};

export const stockAdminActionsStyle: CSSProperties = { display: 'flex', gap: 12 };

export const stockAdminLoadingStyle: CSSProperties = { color: '#888' };

export const stockAdminErrorStyle: CSSProperties = { color: '#b00020', margin: 0 };

export const stockAdminSuccessStyle: CSSProperties = { color: '#0a6640', margin: 0 };

export const stockAdminDeepLinkStyle: CSSProperties = { fontSize: 12, color: '#888', marginTop: 24 };

export const stockAdminDeepLinkButtonStyle: CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#0066cc',
  cursor: 'pointer',
  padding: 0,
};
