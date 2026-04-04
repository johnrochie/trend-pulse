import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import ArticleImage from '@/components/ArticleImage';

interface Article {
  id: number | string;
  title: string;
  category: string;
  slug: string;
  publishedAt: string;
  trendingScore: number;
  imageUrl?: string;
  sourceName?: string;
}

interface TrendingSidebarProps {
  currentSlug: string;
  articles: Article[];
  currentCategory?: string;
}

function formatDate(dateString: string): string {
  try {
    return format(parseISO(dateString), 'MMM d');
  } catch {
    return '';
  }
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-blue-600/20 text-blue-300 capitalize">
      {category}
    </span>
  );
}

export default function TrendingSidebar({ currentSlug, articles, currentCategory }: TrendingSidebarProps) {
  const others = articles.filter((a) => a.slug !== currentSlug);

  const trending = [...others]
    .sort((a, b) => (b.trendingScore ?? 0) - (a.trendingScore ?? 0))
    .slice(0, 6);

  const moreSameCategory = currentCategory
    ? others
        .filter((a) => a.category?.toLowerCase() === currentCategory.toLowerCase())
        .sort((a, b) => (b.trendingScore ?? 0) - (a.trendingScore ?? 0))
        .slice(0, 3)
    : [];

  return (
    <div className="sticky top-24 space-y-6">
      {/* Trending Now */}
      <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <h2 className="text-base font-bold text-white">Trending Now</h2>
        </div>

        <ul className="space-y-4">
          {trending.map((article) => (
            <li key={article.slug}>
              <Link href={`/article/${article.slug}`} className="flex gap-3 group">
                <div className="flex-shrink-0 w-20 h-[60px] rounded-lg overflow-hidden bg-gray-700">
                  <ArticleImage
                    article={article}
                    width={80}
                    height={60}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-200 font-medium line-clamp-2 group-hover:text-blue-300 transition-colors leading-snug mb-1">
                    {article.title}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CategoryBadge category={article.category} />
                    {article.publishedAt && (
                      <span className="text-xs text-gray-500">{formatDate(article.publishedAt)}</span>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* More in category */}
      {moreSameCategory.length > 0 && currentCategory && (
        <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-4">
          <h2 className="text-base font-bold text-white mb-4 capitalize">
            More {currentCategory} News
          </h2>

          <ul className="space-y-4">
            {moreSameCategory.map((article) => (
              <li key={article.slug}>
                <Link href={`/article/${article.slug}`} className="flex gap-3 group">
                  <div className="flex-shrink-0 w-20 h-[60px] rounded-lg overflow-hidden bg-gray-700">
                    <ArticleImage
                      article={article}
                      width={80}
                      height={60}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 font-medium line-clamp-2 group-hover:text-blue-300 transition-colors leading-snug mb-1">
                      {article.title}
                    </p>
                    {article.publishedAt && (
                      <span className="text-xs text-gray-500">{formatDate(article.publishedAt)}</span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
