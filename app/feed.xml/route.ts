import { NextResponse } from 'next/server';
import { fetchArticles } from '@/lib/articles-api';
import { config } from '@/lib/config';

export async function GET() {
  const baseUrl = config.site.url;
  const res = await fetchArticles({ limit: 50 });
  const articles = res.success && res.data?.length ? res.data : [];

  const getItemLink = (a: { type?: string; slug?: string }) => {
    if ((a as { type?: string }).type === 'daily-digest' && a.slug) {
      const date = a.slug.replace('daily-digest-', '');
      return `${baseUrl}/daily-digest/${date}`;
    }
    return `${baseUrl}/article/${a.slug}`;
  };

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(config.site.name)}</title>
    <link>${baseUrl}</link>
    <description>${escapeXml(config.site.description)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${articles
      .map(
        (a) => `
    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${getItemLink(a)}</link>
      <description>${escapeXml(a.excerpt || '')}</description>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
      <guid isPermaLink="true">${getItemLink(a)}</guid>
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=1800',
    },
  });
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
