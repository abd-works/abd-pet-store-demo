/**
 * Content publishing & unsubscribe — client tests (Increment 8 Sprint 4)
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { CartProvider } from '../../../packages/app-client/src/context/CartContext';
import { BlogIndexPage } from '../../../packages/app-client/src/pages/content/BlogIndexPage';
import { BlogPostPage } from '../../../packages/app-client/src/pages/content/BlogPostPage';
import { GuideIndexPage } from '../../../packages/app-client/src/pages/content/GuideIndexPage';
import { GuideDetailPage } from '../../../packages/app-client/src/pages/content/GuideDetailPage';
import { StaffContentEditorPage } from '../../../packages/app-client/src/pages/staff/StaffContentEditorPage';
import { UnsubscribeConfirmationPage } from '../../../packages/app-client/src/pages/marketing/UnsubscribeConfirmationPage';

vi.mock('../../../packages/content/client/content.api', () => ({
  fetchBlogPosts: vi.fn(),
  fetchBlogPostBySlug: vi.fn(),
  fetchGuides: vi.fn(),
  fetchGuideBySlug: vi.fn(),
  fetchStaffBlogPosts: vi.fn(),
  fetchStaffGuides: vi.fn(),
  createBlogDraft: vi.fn(),
  createGuideDraft: vi.fn(),
  publishContent: vi.fn(),
  updateContent: vi.fn(),
  executeUnsubscribe: vi.fn(),
}));

import {
  fetchBlogPosts,
  fetchBlogPostBySlug,
  fetchGuides,
  fetchGuideBySlug,
  fetchStaffBlogPosts,
  fetchStaffGuides,
  createBlogDraft,
  publishContent,
  updateContent,
  executeUnsubscribe,
} from '../../../packages/content/client/content.api';

const mockFetchBlogPosts = fetchBlogPosts as ReturnType<typeof vi.fn>;
const mockFetchBlogPostBySlug = fetchBlogPostBySlug as ReturnType<typeof vi.fn>;
const mockFetchGuides = fetchGuides as ReturnType<typeof vi.fn>;
const mockFetchGuideBySlug = fetchGuideBySlug as ReturnType<typeof vi.fn>;
const mockFetchStaffBlogPosts = fetchStaffBlogPosts as ReturnType<typeof vi.fn>;
const mockFetchStaffGuides = fetchStaffGuides as ReturnType<typeof vi.fn>;
const mockCreateBlogDraft = createBlogDraft as ReturnType<typeof vi.fn>;
const mockPublishContent = publishContent as ReturnType<typeof vi.fn>;
const mockUpdateContent = updateContent as ReturnType<typeof vi.fn>;
const mockExecuteUnsubscribe = executeUnsubscribe as ReturnType<typeof vi.fn>;

function renderWithCart(ui: React.ReactElement) {
  return render(<CartProvider>{ui}</CartProvider>);
}

describe('Publish Blog Post — customer UI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchBlogPosts.mockResolvedValue([
      {
        id: '1',
        slug: 'spring-pet-safety-tips',
        title: 'Spring Pet Safety Tips',
        summary: 'Keep pets safe',
        publishDate: '2026-05-01',
        author: 'Jamie Wells',
      },
    ]);
  });

  it('AC 1: published post on index with metadata', async () => {
    renderWithCart(<MemoryRouter><BlogIndexPage /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText('Spring Pet Safety Tips')).toBeInTheDocument();
    });
    expect(screen.getByText('Keep pets safe')).toBeInTheDocument();
    expect(screen.getByText(/Jamie Wells/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Read Post' })).toHaveAttribute('href', '/blog/spring-pet-safety-tips');
  });

  it('AC 4: direct URL shows full article', async () => {
    mockFetchBlogPostBySlug.mockResolvedValue({
      id: '1',
      slug: 'spring-pet-safety-tips',
      title: 'Spring Pet Safety Tips',
      summary: 'Keep pets safe',
      body: 'Full article body text',
      author: 'Jamie Wells',
      publishDate: '2026-05-01',
      status: 'published',
    });
    renderWithCart(
      <MemoryRouter initialEntries={['/blog/spring-pet-safety-tips']}>
        <Routes>
          <Route path="/blog/:slug" element={<BlogPostPage />} />
        </Routes>
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('blog-post-content')).toHaveTextContent('Full article body text');
    });
  });
});

describe('Publish Pet Care Guide — customer UI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchGuides.mockResolvedValue([
      {
        id: 'g1',
        slug: 'introduce-new-cat',
        title: 'Introduce a New Cat',
        summary: 'Room by room',
        speciesTags: ['cats'],
        publishDate: '2026-05-01',
      },
    ]);
  });

  it('AC 1: guide index lists tag and Read Guide link', async () => {
    renderWithCart(<MemoryRouter><GuideIndexPage /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText('Introduce a New Cat')).toBeInTheDocument();
    });
    expect(screen.getByText(/cats/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Read Guide' })).toHaveAttribute('href', '/guides/introduce-new-cat');
  });

  it('AC 1: guide detail shows species tag badge', async () => {
    mockFetchGuideBySlug.mockResolvedValue({
      id: 'g1',
      slug: 'introduce-new-cat',
      title: 'Introduce a New Cat',
      summary: 'Room by room',
      body: 'Guide body',
      speciesTags: ['cats'],
      publishDate: '2026-05-01',
      status: 'published',
    });
    renderWithCart(
      <MemoryRouter initialEntries={['/guides/introduce-new-cat']}>
        <Routes>
          <Route path="/guides/:slug" element={<GuideDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('guide-detail-content')).toHaveTextContent('cats');
    });
  });
});

describe('Publish Blog Post — staff editor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchStaffBlogPosts.mockResolvedValue([]);
    mockFetchStaffGuides.mockResolvedValue([]);
    mockCreateBlogDraft.mockResolvedValue({
      id: 'draft-1',
      slug: 'new-post',
      title: '',
      summary: '',
      body: '',
      author: 'Staff Author',
      status: 'draft',
      publishDate: null,
    });
    mockUpdateContent.mockResolvedValue({});
    mockPublishContent.mockResolvedValue({});
  });

  it('AC 2: draft hidden from customer index when list empty', async () => {
    mockFetchBlogPosts.mockResolvedValue([]);
    renderWithCart(<MemoryRouter><BlogIndexPage /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText('PawPlace Blog')).toBeInTheDocument();
    });
    expect(screen.queryByText('draft-only')).not.toBeInTheDocument();
  });

  it('AC 4: publish blocked without guide tag shows validation', async () => {
    mockFetchStaffGuides.mockResolvedValue([
      {
        id: 'g-draft',
        slug: 'untitled',
        title: 'Untitled Guide',
        summary: '',
        body: '',
        speciesTags: [],
        status: 'draft',
        publishDate: null,
      },
    ]);
    render(<MemoryRouter><StaffContentEditorPage /></MemoryRouter>);
    fireEvent.click(screen.getByRole('tab', { name: 'Pet Care Guides' }));
    await waitFor(() => expect(screen.getByText(/Untitled Guide/)).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    fireEvent.click(screen.getAllByRole('button', { name: 'Publish' }).at(-1)!);
    await waitFor(() => {
      expect(screen.getByTestId('tag-required-validation')).toHaveTextContent(
        'At least one pet type or species tag is required before publishing',
      );
    });
  });
});

describe('Unsubscribe from Marketing Emails — confirmation UI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockExecuteUnsubscribe.mockResolvedValue({
      message: "You've been unsubscribed from Promotions",
      category: 'promotions',
      categoryLabel: 'Promotions',
    });
  });

  it('AC 1: token processed shows confirmation and preferences link', async () => {
    renderWithCart(
      <MemoryRouter initialEntries={['/marketing/unsubscribe/test-token']}>
        <Routes>
          <Route path="/marketing/unsubscribe/:token" element={<UnsubscribeConfirmationPage />} />
        </Routes>
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('unsubscribe-confirmation')).toHaveTextContent("You've been unsubscribed");
    });
    expect(screen.getByText('Promotions')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Manage Communication Preferences' })).toHaveAttribute(
      'href',
      '/account/communication',
    );
    expect(screen.getByRole('button', { name: 'Continue Shopping' })).toBeInTheDocument();
  });

  it('AC 4: idempotent note visible after unsubscribe', async () => {
    renderWithCart(
      <MemoryRouter initialEntries={['/marketing/unsubscribe/test-token']}>
        <Routes>
          <Route path="/marketing/unsubscribe/:token" element={<UnsubscribeConfirmationPage />} />
        </Routes>
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByText(/already unsubscribed note/)).toBeInTheDocument();
    });
  });
});
