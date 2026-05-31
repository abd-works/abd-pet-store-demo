import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CustomerPage } from '../../components/CustomerPage';
import { fetchBlogPostBySlug, type BlogPostDto } from '../../../../content/client/content.api';

export function BlogPostPage() {
  const { slug = '' } = useParams();
  const [post, setPost] = useState<BlogPostDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchBlogPostBySlug(slug)
      .then(setPost)
      .catch(() => setError('Blog post not found'));
  }, [slug]);

  return (
    <CustomerPage title="blog post detail">
      <nav aria-label="breadcrumb">
        <Link to="/blog">Blog</Link>
        {post && <> · {post.title}</>}
      </nav>
      {error && <p role="alert">{error}</p>}
      {post && (
        <article data-testid="blog-post-content">
          <h1>{post.title}</h1>
          <p style={{ color: '#666' }}>
            {post.author} · {post.publishDate}
          </p>
          <div style={{ marginTop: 16, whiteSpace: 'pre-wrap' }}>{post.body}</div>
        </article>
      )}
    </CustomerPage>
  );
}
