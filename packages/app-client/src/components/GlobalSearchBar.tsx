import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function GlobalSearchBar() {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const params = new URLSearchParams(search);
  const currentQ = params.get('q') ?? '';

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const keyword = String(formData.get('q') ?? '').trim();
    const next = new URLSearchParams(search);
    if (keyword) next.set('q', keyword);
    else next.delete('q');
    const query = next.toString();
    navigate(`/catalog/search${query ? `?${query}` : ''}`);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
      <input
        name="q"
        type="search"
        defaultValue={pathname.startsWith('/catalog/search') ? currentQ : ''}
        placeholder="Search products…"
        aria-label="Search products"
        style={{ padding: '6px 10px', minWidth: 180 }}
      />
      <button type="submit">Search</button>
    </form>
  );
}
