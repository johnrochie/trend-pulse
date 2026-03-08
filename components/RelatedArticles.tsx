import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Eye, TrendingUp, ArrowRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { getArticleImage, getImageAltText } from '@/lib/images';

export interface RelatedArticle {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  views: number;
  trendingScore: number;
  publishedAt: string;
  slug: string;
  imageUrl: string;
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
  currentCategory: string;
}

export default function RelatedArticles({ articles, currentCategory }: RelatedArticlesProps) {
  if (!articles || articles.length === 0) {
    return null;
  }

  const articlesUrl = `/articles?category=${encodeURIComponent(currentCategory)}`;

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-space text-2xl font-bold text-white">More on {currentCategory}</h3>
        <Link
          href={articlesUrl}
          className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
        >
          View all {currentCategory} articles
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/article/${article.slug}`}
            prefetch
            className="group block bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all"
          >
            <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900">
              <Image
                src={getArticleImage(article)}
                alt={getImageAltText(article)}
                width={400}
                height={225}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute top-3 left-3">
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-900/80 backdrop-blur-sm text-white">
                  {article.category}
                </span>
              </div>
            </div>

            <div className="p-5">
              <h4 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                {article.title}
              </h4>

              <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                {article.excerpt}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(parseISO(article.publishedAt), 'MMM d')}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {article.views?.toLocaleString?.() ?? '—'}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {article.trendingScore ?? '—'}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
