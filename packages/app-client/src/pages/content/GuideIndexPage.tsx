import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CustomerPage } from '../../components/CustomerPage';
import { fetchGuides, type GuideSummaryDto } from '../../../../content/client/content.api';

const FILTER_TABS = ['All', 'Dogs', 'Cats', 'Senior Pets', 'Small Animals'] as const;

const FILTER_TO_TAG: Record<string, string | undefined> = {
  All: undefined,
  Dogs: 'dogs',
  Cats: 'cats',
  'Senior Pets': 'senior pets',
  'Small Animals': 'small animals',
};

export function GuideIndexPage() {
  const [activeFilter, setActiveFilter] = useState<(typeof FILTER_TABS)[number]>('All');
  const [guides, setGuides] = useState<GuideSummaryDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tag = FILTER_TO_TAG[activeFilter];
    void fetchGuides(tag)
      .then(setGuides)
      .catch(() => setError('Unable to load pet care guides'));
  }, [activeFilter]);

  return (
    <CustomerPage title="pet care guide index">
      <h1>Pet Care Guides</h1>
      <div role="tablist" aria-label="pet type filter" style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeFilter === tab}
            onClick={() => setActiveFilter(tab)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ccc',
              background: activeFilter === tab ? '#eee' : '#fff',
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      {error && <p role="alert">{error}</p>}
      <ul style={{ listStyle: 'none', padding: 0 }} aria-label="pet care guide listing">
        {guides.map((guide) => (
          <li key={guide.id} style={{ marginBottom: 16, borderBottom: '1px solid #eee', paddingBottom: 12 }}>
            <h2>{guide.title}</h2>
            <p>{guide.summary}</p>
            <p style={{ fontSize: 14, color: '#666' }}>
              {guide.speciesTags.join(', ')} · {guide.publishDate}
            </p>
            <Link to={`/guides/${guide.slug}`}>Read Guide</Link>
          </li>
        ))}
      </ul>
    </CustomerPage>
  );
}
