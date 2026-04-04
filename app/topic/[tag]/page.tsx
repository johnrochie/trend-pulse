import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchArticles, Article } from '@/lib/articles-api';
import { tagToSlug, slugToTag } from '@/lib/tag-utils';
import Breadcrumbs from '@/components/Breadcrumbs';
import ArticleImage from '@/components/ArticleImage';
import { Hash, TrendingUp, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export const revalidate = 300;

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const tagName = slugToTag(decodeURIComponent(tag));
  return {
    title: `${tagName} News & Articles | Trend Pulse`,
    description: `Browse all Trend Pulse articles tagged with "${tagName}". Stay informed with the latest news and analysis.`,
    alternates: { canonical: `/topic/${tag}` },
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const tagSlug = decodeURIComponent(tag);
  const tagName = slugToTag(tagSlug);

  const response = await fetchArticles({ limit: 200 });
  const allArticles =
    response.success && response.data
      ? response.data.filter(
          (a) =>
            a.type !== 'daily-digest' && !a.slug?.startsWith('daily-digest-')
        )
      : [];

  // Filter articles whose tags include any tag that slugifies to the param
  const articles: Article[] = allArticles.filter((article) =>
    Array.isArray(article.tags) &&
    article.tags.some((t) => tagToSlug(t) === tagSlug)
  );

  // If no articles and the slug looks bogus (no hyphens, very long, etc.) → 404
  if (articles.length === 0 && allArticles.length > 0) {
    // Still render a helpful page — don't 404 so search engines can index the tag.
    // (notFound() left as an option if you prefer strict 404 behaviour.)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Topics', href: '/topic' },
            { label: tagName },
          ]}
        />

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-5">
            <Hash className="w-4 h-4" />
            <span>Topic</span>
          </div>
          <h1 className="font-space text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {tagName}
          </h1>
          <p className="text-gray-400 text-lg">
            {articles.length === 0
              ? 'No articles found for this topic.'
              : `${articles.length} ${articles.length === 1 ? 'article' : 'articles'} tagged with "${tagName}"`}
          </p>
        </div>

        {/* Articles grid */}
        {articles.length === 0 ? (
          <div className="text-center py-20">
            <Hash className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-300 mb-2">No articles yet</h2>
            <p className="text-gray-500 mb-6">
              There are no articles tagged with &ldquo;{tagName}&rdquo; at the moment.
            </p>
            <Link
              href="/topic"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
            >
              Browse all topics
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <article key={article.id} className="group">
                <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden hover:border-gray-600 transition-all h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 flex-shrink-0">
                    <ArticleImage
                      article={article}
                      width={400}
                      height={225}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-800/80 text-gray-300 backdrop-blur-sm">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <h2 className="font-medium text-lg text-white mb-2 group-hover:text-blue-300 transition-colors line-clamp-3 flex-1">
                      <Link href={`/article/${article.slug}`}>{article.title}</Link>
                    </h2>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{article.excerpt}</p>

                    {/* Tags */}
                    {Array.isArray(article.tags) && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {article.tags.slice(0, 4).map((t) => {
                          const tSlug = tagToSlug(t);
                          return (
                            <Link
                              key={tSlug}
                              href={`/topic/${tSlug}`}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-colors ${
                                tSlug === tagSlug
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                  : 'bg-gray-700/50 text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                              }`}
                            >
                              <Hash className="w-2.5 h-2.5" />
                              {t}
                            </Link>
                          );
                        })}
                      </div>
                    )}

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>{article.trendingScore}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {article.publishedAt
                            ? format(parseISO(article.publishedAt), 'MMM d, yyyy')
                            : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Back link */}
        {articles.length > 0 && (
          <div className="mt-10 text-center">
            <Link
              href="/topic"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              <Hash className="w-4 h-4" />
              Browse all topics
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
