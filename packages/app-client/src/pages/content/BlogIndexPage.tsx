import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CustomerPage } from '../../components/CustomerPage';
import {
  fetchBlogPosts,
  type BlogPostSummaryDto,
} from '../../../../content/client/content.api';

export function BlogIndexPage() {
  const [posts, setPosts] = useState<BlogPostSummaryDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchBlogPosts()
      .then(setPosts)
      .catch(() => setError('Unable to load blog posts'));
  }, []);

  return (
    <CustomerPage title="blog index">
      <h1>PawPlace Blog</h1>
      {error && <p role="alert">{error}</p>}
      <ul style={{ listStyle: 'none', padding: 0 }} aria-label="blog post listing">
        {posts.map((post) => (
          <li key={post.id} style={{ marginBottom: 16, borderBottom: '1px solid #eee', paddingBottom: 12 }}>
            <h2>{post.title}</h2>
            <p>{post.summary}</p>
            <p style={{ fontSize: 14, color: '#666' }}>
              {post.publishDate} · {post.author}
            </p>
            <Link to={`/blog/${post.slug}`}>Read Post</Link>
          </li>
        ))}
      </ul>
    </CustomerPage>
  );
}
