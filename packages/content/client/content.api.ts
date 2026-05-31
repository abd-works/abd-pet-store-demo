import { httpJson } from '../../shared/http-client';

export interface BlogPostSummaryDto {
  id: string;
  slug: string;
  title: string;
  summary: string;
  publishDate: string | null;
  author: string;
}

export interface BlogPostDto extends BlogPostSummaryDto {
  body: string;
  status: 'draft' | 'published';
}

export interface GuideSummaryDto {
  id: string;
  slug: string;
  title: string;
  summary: string;
  publishDate: string | null;
  speciesTags: string[];
}

export interface GuideDto extends GuideSummaryDto {
  body: string;
  status: 'draft' | 'published';
}

export async function fetchBlogPosts(): Promise<BlogPostSummaryDto[]> {
  return httpJson<BlogPostSummaryDto[]>('/api/content/blog');
}

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPostDto> {
  return httpJson<BlogPostDto>(`/api/content/blog/${encodeURIComponent(slug)}`);
}

export async function fetchGuides(speciesTag?: string): Promise<GuideSummaryDto[]> {
  const query = speciesTag ? `?speciesTag=${encodeURIComponent(speciesTag)}` : '';
  return httpJson<GuideSummaryDto[]>(`/api/content/guides${query}`);
}

export async function fetchGuideBySlug(slug: string): Promise<GuideDto> {
  return httpJson<GuideDto>(`/api/content/guides/${encodeURIComponent(slug)}`);
}

export async function fetchStaffBlogPosts(): Promise<BlogPostDto[]> {
  return httpJson<BlogPostDto[]>('/api/staff/content/blog');
}

export async function fetchStaffGuides(): Promise<GuideDto[]> {
  return httpJson<GuideDto[]>('/api/staff/content/guides');
}

export async function createBlogDraft(input: {
  title: string;
  summary: string;
  body: string;
  author: string;
}): Promise<BlogPostDto> {
  return httpJson<BlogPostDto>('/api/staff/content/blog', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function createGuideDraft(input: {
  title: string;
  summary: string;
  body: string;
  speciesTags: string[];
}): Promise<GuideDto> {
  return httpJson<GuideDto>('/api/staff/content/guides', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function publishContent(contentId: string): Promise<BlogPostDto | GuideDto> {
  return httpJson(`/api/staff/content/${encodeURIComponent(contentId)}/publish`, {
    method: 'POST',
  });
}

export async function updateContent(
  contentId: string,
  input: {
    title?: string;
    summary?: string;
    body?: string;
    speciesTags?: string[];
    preservePublishDate?: boolean;
  },
): Promise<BlogPostDto | GuideDto> {
  return httpJson(`/api/staff/content/${encodeURIComponent(contentId)}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export interface UnsubscribeResultDto {
  message: string;
  category: string;
  categoryLabel: string;
}

export async function executeUnsubscribe(token: string): Promise<UnsubscribeResultDto> {
  return httpJson<UnsubscribeResultDto>(`/api/marketing/unsubscribe/${encodeURIComponent(token)}`);
}
