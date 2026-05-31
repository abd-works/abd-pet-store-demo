import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CustomerPage } from '../../components/CustomerPage';
import { fetchGuideBySlug, type GuideDto } from '../../../../content/client/content.api';

export function GuideDetailPage() {
  const { slug = '' } = useParams();
  const [guide, setGuide] = useState<GuideDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchGuideBySlug(slug)
      .then(setGuide)
      .catch(() => setError('Guide not found'));
  }, [slug]);

  return (
    <CustomerPage title="pet care guide detail">
      <nav aria-label="breadcrumb">
        <Link to="/guides">Pet Care Guides</Link>
        {guide && <> · {guide.title}</>}
      </nav>
      {error && <p role="alert">{error}</p>}
      {guide && (
        <article data-testid="guide-detail-content">
          <h1>{guide.title}</h1>
          <p>
            {guide.speciesTags.map((tag) => (
              <span
                key={tag}
                style={{
                  display: 'inline-block',
                  marginRight: 8,
                  padding: '2px 8px',
                  background: '#eee',
                  borderRadius: 4,
                  fontSize: 13,
                }}
              >
                {tag}
              </span>
            ))}
          </p>
          <p style={{ color: '#666' }}>{guide.publishDate}</p>
          <div style={{ marginTop: 16, whiteSpace: 'pre-wrap' }}>{guide.body}</div>
        </article>
      )}
    </CustomerPage>
  );
}
