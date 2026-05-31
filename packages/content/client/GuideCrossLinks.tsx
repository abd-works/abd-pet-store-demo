import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchGuides, type GuideSummaryDto } from './content.api';

const SPECIES_TO_TAG: Record<string, string | undefined> = {
  Dogs: 'dogs',
  Cats: 'cats',
  'Senior Pets': 'senior pets',
  'Small Animals': 'small animals',
  'Small Mammals': 'small animals',
  Reptiles: 'reptiles',
};

const CATEGORY_TO_TAG: Record<string, string | undefined> = {
  'Dog Supplies': 'dogs',
  'Cat Supplies': 'cats',
  'Dog Food': 'dogs',
  'Cat Food': 'cats',
};

function resolveTag(speciesOrCategory: string): string | undefined {
  if (speciesOrCategory === 'All' || !speciesOrCategory) return undefined;
  return SPECIES_TO_TAG[speciesOrCategory] ?? CATEGORY_TO_TAG[speciesOrCategory] ?? (
    speciesOrCategory.toLowerCase().includes('dog') ? 'dogs'
      : speciesOrCategory.toLowerCase().includes('cat') ? 'cats'
        : undefined
  );
}

interface GuideCrossLinksProps {
  speciesOrCategory: string;
  testId?: string;
}

export function GuideCrossLinks({ speciesOrCategory, testId = 'guide-cross-links' }: GuideCrossLinksProps) {
  const [guides, setGuides] = useState<GuideSummaryDto[]>([]);
  const tag = resolveTag(speciesOrCategory);

  useEffect(() => {
    if (!tag) {
      setGuides([]);
      return;
    }
    void fetchGuides(tag)
      .then(setGuides)
      .catch(() => setGuides([]));
  }, [tag]);

  if (!tag || guides.length === 0) return null;

  return (
    <aside data-testid={testId} aria-label="related pet care guides" style={{ marginTop: 16, padding: 12, background: '#f9fafb', borderRadius: 8 }}>
      <h2 style={{ fontSize: 14, marginBottom: 8 }}>Pet Care Guides</h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {guides.map((guide) => (
          <li key={guide.id} style={{ marginBottom: 6 }}>
            <Link to={`/guides/${guide.slug}`}>{guide.title}</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
