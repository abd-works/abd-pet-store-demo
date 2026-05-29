import React from 'react';
import { Link } from 'react-router-dom';
import type { ProductSummaryDTO } from './product-catalog.api';
import { categoryButtonStyle } from './productCatalogUiStyles';

export function CategoryOption({
  label,
  active,
  onSelect,
}: {
  label: string;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button type="button" role="option" aria-selected={active} onClick={onSelect} style={categoryButtonStyle(active)}>
        {label}
      </button>
    </li>
  );
}

export function ProductGridRow({ product }: { product: ProductSummaryDTO }) {
  return (
    <li data-testid="product-row" style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #eee' }}>
      <div aria-hidden style={{ width: 48, height: 48, background: '#e8e8e8', borderRadius: 4, fontSize: 10, color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        thumbnail
      </div>
      <div style={{ flex: 1 }}>
        <strong>{product.name}</strong>
        <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>{product.category_name} · {product.price}</div>
      </div>
      <Link to={`/products/${product.sku}`} data-testid="select-product">select product</Link>
    </li>
  );
}
