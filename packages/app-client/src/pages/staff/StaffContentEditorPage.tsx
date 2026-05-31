import React, { useCallback, useEffect, useState } from 'react';
import { StaffPage } from '../../components/CustomerPage';
import { StaffNav } from '../../components/StaffNav';
import {
  createBlogDraft,
  createGuideDraft,
  fetchStaffBlogPosts,
  fetchStaffGuides,
  publishContent,
  updateContent,
  type BlogPostDto,
  type GuideDto,
} from '../../../../content/client/content.api';

type ContentTab = 'blog' | 'guide';

const SPECIES_OPTIONS = ['dogs', 'cats', 'senior pets', 'small animals'];

export function StaffContentEditorPage() {
  const [tab, setTab] = useState<ContentTab>('blog');
  const [blogPosts, setBlogPosts] = useState<BlogPostDto[]>([]);
  const [guides, setGuides] = useState<GuideDto[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [body, setBody] = useState('');
  const [author, setAuthor] = useState('Content Author');
  const [speciesTag, setSpeciesTag] = useState('');
  const [preservePublishDate, setPreservePublishDate] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const loadLists = useCallback(async () => {
    const [posts, guideList] = await Promise.all([fetchStaffBlogPosts(), fetchStaffGuides()]);
    setBlogPosts(posts);
    setGuides(guideList);
  }, []);

  useEffect(() => {
    void loadLists().catch(() => setStatusMessage('Unable to load content'));
  }, [loadLists]);

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setSummary('');
    setBody('');
    setAuthor('Content Author');
    setSpeciesTag('');
    setValidationError(null);
  };

  const loadBlog = (post: BlogPostDto) => {
    setEditingId(post.id);
    setTitle(post.title);
    setSummary(post.summary);
    setBody(post.body);
    setAuthor(post.author);
    setValidationError(null);
  };

  const loadGuide = (guide: GuideDto) => {
    setEditingId(guide.id);
    setTitle(guide.title);
    setSummary(guide.summary);
    setBody(guide.body);
    setSpeciesTag(guide.speciesTags[0] ?? '');
    setValidationError(null);
  };

  const handleSaveDraft = async () => {
    setValidationError(null);
    setStatusMessage(null);
    try {
      if (editingId) {
        await updateContent(editingId, { title, summary, body, preservePublishDate });
      } else if (tab === 'blog') {
        const created = await createBlogDraft({ title, summary, body, author });
        setEditingId(created.id);
      } else {
        const created = await createGuideDraft({
          title,
          summary,
          body,
          speciesTags: speciesTag ? [speciesTag] : [],
        });
        setEditingId(created.id);
      }
      setStatusMessage('Draft saved');
      await loadLists();
    } catch {
      setStatusMessage('Unable to save draft');
    }
  };

  const handlePublish = async () => {
    setValidationError(null);
    setStatusMessage(null);
    try {
      let contentId = editingId;
      if (!contentId) {
        if (tab === 'blog') {
          const created = await createBlogDraft({ title, summary, body, author });
          contentId = created.id;
        } else {
          const created = await createGuideDraft({
            title,
            summary,
            body,
            speciesTags: speciesTag ? [speciesTag] : [],
          });
          contentId = created.id;
        }
        setEditingId(contentId);
      } else if (tab === 'guide' && !speciesTag) {
        setValidationError('At least one pet type or species tag is required before publishing');
        return;
      } else {
        await updateContent(contentId, {
          title,
          summary,
          body,
          speciesTags: tab === 'guide' && speciesTag ? [speciesTag] : undefined,
          preservePublishDate,
        });
      }
      await publishContent(contentId);
      setStatusMessage('Published');
      await loadLists();
    } catch (err) {
      const apiErr = err as Error & { status?: number };
      if (apiErr.status === 422 || apiErr.message.includes('tag')) {
        setValidationError('At least one pet type or species tag is required before publishing');
        return;
      }
      setStatusMessage('Unable to publish');
    }
  };

  const items = tab === 'blog' ? blogPosts : guides;

  return (
    <StaffPage title="admin — content editor">
      <StaffNav />
      <div role="tablist" aria-label="content type selector" style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button type="button" role="tab" aria-selected={tab === 'blog'} onClick={() => { setTab('blog'); resetForm(); }}>
          Blog Posts
        </button>
        <button type="button" role="tab" aria-selected={tab === 'guide'} onClick={() => { setTab('guide'); resetForm(); }}>
          Pet Care Guides
        </button>
      </div>
      <button type="button" onClick={resetForm} style={{ marginBottom: 12 }}>
        New Post
      </button>
      <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24 }} aria-label="content list">
        {items.map((item) => (
          <li key={item.id} style={{ marginBottom: 8 }}>
            {item.title} · {item.status} · {item.publishDate ?? 'no date'}
            {' '}
            <button
              type="button"
              onClick={() => (tab === 'blog' ? loadBlog(item as BlogPostDto) : loadGuide(item as GuideDto))}
            >
              Edit
            </button>
            {item.status === 'draft' && (
              <button
                type="button"
                onClick={() => {
                  if (tab === 'guide' && (item as GuideDto).speciesTags.length === 0) {
                    setValidationError('At least one pet type or species tag is required before publishing');
                    loadGuide(item as GuideDto);
                    return;
                  }
                  void publishContent(item.id).then(loadLists).catch(() => {
                    setValidationError('At least one pet type or species tag is required before publishing');
                  });
                }}
              >
                Publish
              </button>
            )}
          </li>
        ))}
      </ul>
      {validationError && (
        <p role="alert" data-testid="tag-required-validation">
          {validationError}
        </p>
      )}
      {statusMessage && <p role="status">{statusMessage}</p>}
      <form aria-label={tab === 'blog' ? 'blog post editor' : 'pet care guide editor'} onSubmit={(e) => e.preventDefault()}>
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="content-title">title</label>
          <input id="content-title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ display: 'block', width: '100%', maxWidth: 480 }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="content-summary">summary</label>
          <textarea id="content-summary" value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} style={{ display: 'block', width: '100%', maxWidth: 480 }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="content-body">body content</label>
          <textarea id="content-body" value={body} onChange={(e) => setBody(e.target.value)} rows={6} style={{ display: 'block', width: '100%', maxWidth: 480 }} />
        </div>
        {tab === 'blog' ? (
          <div style={{ marginBottom: 8 }}>
            <label htmlFor="content-author">author</label>
            <input id="content-author" value={author} onChange={(e) => setAuthor(e.target.value)} style={{ display: 'block', width: '100%', maxWidth: 480 }} />
          </div>
        ) : (
          <div style={{ marginBottom: 8 }}>
            <label htmlFor="content-species-tag">pet type/species tag</label>
            <select id="content-species-tag" value={speciesTag} onChange={(e) => setSpeciesTag(e.target.value)}>
              <option value="">Select tag</option>
              {SPECIES_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        )}
        {editingId && items.find((i) => i.id === editingId)?.status === 'published' && (
          <div style={{ marginBottom: 8 }}>
            <p>Publish date will not change unless you update it explicitly</p>
            <label>
              <input
                type="checkbox"
                checked={!preservePublishDate}
                onChange={(e) => setPreservePublishDate(!e.target.checked)}
              />
              {' '}
              update publish date
            </label>
          </div>
        )}
        <button type="button" onClick={() => void handleSaveDraft()} style={{ marginRight: 8 }}>
          Save as Draft
        </button>
        <button type="button" onClick={() => void handlePublish()}>
          Publish
        </button>
      </form>
    </StaffPage>
  );
}
