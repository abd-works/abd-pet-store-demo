import type { CSSProperties } from 'react';
import { SIDEBAR_MIN_WIDTH_PX } from '../../shared/layout-tokens';

export const categoryAsideStyle: CSSProperties = { minWidth: SIDEBAR_MIN_WIDTH_PX };
export const categoryListStyle: CSSProperties = { listStyle: 'none', padding: 0, margin: 0 };
export const categoryHeadingStyle: CSSProperties = { fontSize: 14, marginBottom: 8 };

export function categoryButtonStyle(active: boolean): CSSProperties {
  return {
    width: '100%',
    textAlign: 'left',
    padding: '6px 8px',
    background: active ? '#eef4ff' : 'transparent',
    border: 'none',
    cursor: 'pointer',
  };
}

export const catalogGridStyle: CSSProperties = { display: 'flex', gap: 24 };
export const catalogSectionStyle: CSSProperties = { flex: 1, minWidth: SIDEBAR_MIN_WIDTH_PX };
export const catalogLoadingStyle: CSSProperties = { color: '#888' };
export const productDetailLoadingStyle: CSSProperties = { color: '#888' };
export const productDetailBreadcrumbStyle: CSSProperties = { fontSize: 14, marginBottom: 16 };
export const productDetailHeaderStyle: CSSProperties = { marginBottom: 20 };
export const productDetailTitleStyle: CSSProperties = { fontSize: 22, margin: '0 0 8px' };
export const productDetailMetaStyle: CSSProperties = { margin: 0, color: '#555' };
export const productGallerySectionStyle: CSSProperties = { marginBottom: 20 };
export const productGalleryThumbnailsStyle: CSSProperties = { display: 'flex', gap: 8, marginBottom: 12 };
export const productGalleryMainImageStyle: CSSProperties = { maxWidth: '100%', maxHeight: 320, borderRadius: 4 };
export const productGalleryNavStyle: CSSProperties = { display: 'flex', gap: 8, marginTop: 12 };
export const productDescriptionSectionStyle: CSSProperties = { marginBottom: 16 };
export const productDimensionsStyle: CSSProperties = {
  display: 'flex',
  gap: 16,
  alignItems: 'center',
  flexWrap: 'wrap',
};

export function productThumbnailButtonStyle(active: boolean): CSSProperties {
  return {
    padding: 0,
    border: active ? '2px solid #333' : '1px solid #ccc',
    cursor: 'pointer',
    background: 'none',
  };
}

export const productThumbnailImageStyle: CSSProperties = { display: 'block', objectFit: 'cover' };
