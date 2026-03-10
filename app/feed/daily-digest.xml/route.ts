/**
 * RSS feed with only daily digests.
 * Use with IFTTT, Zapier, or similar: "When new RSS item → post to Twitter/Facebook/Instagram"
 * No API cost for us; user connects their own automation.
 */
import { NextResponse } from 'next/server';
import { fetchArticles } from '@/lib/articles-api';
import { config } from '@/lib/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = config.site.url;
  const res = await fetchArticles({ type: 'daily-digest', limit: 30 });
  const digests = res.success && res.data?.length ? res.data : [];

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(config.site.name)} - Daily Digest</title>
    <link>${baseUrl}/daily-digest</link>
    <description>${escapeXml(config.site.description)} - AI-powered daily news summaries</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed/daily-digest.xml" rel="self" type="application/rss+xml" />
    ${digests
      .map((d) => {
        const dateSlug = (d.slug || '').replace('daily-digest-', '');
        const link = `${baseUrl}/daily-digest/${dateSlug}`;
        return `
    <item>
      <title>${escapeXml(d.title || '')}</title>
      <link>${link}</link>
      <description>${escapeXml(d.excerpt || '')}</description>
      <pubDate>${new Date(d.publishedAt).toUTCString()}</pubDate>
      <guid isPermaLink="true">${link}</guid>
    </item>`;
      })
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
  return (s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
