import { Metadata } from 'next';
import Link from 'next/link';
import { fetchArticles } from '@/lib/articles-api';
import { tagToSlug } from '@/lib/tag-utils';
import { Hash } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Topics | Trend Pulse',
  description:
    'Browse all topics covered on Trend Pulse. Find news and analysis organised by tag — from Artificial Intelligence to Finance, Technology, and more.',
  alternates: { canonical: '/topic' },
};

export const revalidate = 300;

export default async function TopicsPage() {
  const response = await fetchArticles({ limit: 200 });
  const articles =
    response.success && response.data
      ? response.data.filter(
          (a) =>
            a.type !== 'daily-digest' && !a.slug?.startsWith('daily-digest-')
        )
      : [];

  // Count articles per tag (keyed by slug to deduplicate case variants)
  const tagCounts = new Map<string, { display: string; count: number }>();
  for (const article of articles) {
    if (!Array.isArray(article.tags)) continue;
    for (const tag of article.tags) {
      if (!tag?.trim()) continue;
      const slug = tagToSlug(tag);
      if (!slug) continue;
      const existing = tagCounts.get(slug);
      if (existing) {
        existing.count += 1;
      } else {
        tagCounts.set(slug, { display: tag.trim(), count: 1 });
      }
    }
  }

  // Sort by article count descending
  const sortedTags = Array.from(tagCounts.entries())
    .map(([slug, { display, count }]) => ({ slug, display, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
            <Hash className="w-4 h-4" />
            <span>All Topics</span>
          </div>
          <h1 className="font-space text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Browse by Topic
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore {sortedTags.length} topics across {articles.length}+ articles. Click any tag to
            see all related coverage.
          </p>
        </div>

        {/* Tag grid */}
        {sortedTags.length === 0 ? (
          <p className="text-center text-gray-500">No topics found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {sortedTags.map(({ slug, display, count }) => (
              <Link
                key={slug}
                href={`/topic/${slug}`}
                className="group flex flex-col justify-between bg-gray-800/30 border border-gray-700 rounded-xl p-4 hover:border-gray-600 hover:bg-gray-800/50 transition-all"
              >
                <div className="flex items-start gap-2 mb-3">
                  <Hash className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                  <span className="font-medium text-white text-sm leading-snug group-hover:text-blue-300 transition-colors line-clamp-2">
                    {display}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                  <span className="font-semibold text-purple-400">{count}</span>
                  {count === 1 ? 'article' : 'articles'}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
