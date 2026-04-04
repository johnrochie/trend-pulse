'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { TrendingUp, Zap, ArrowRight, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import ArticleImage from '@/components/ArticleImage';

interface Article {
  id: number | string;
  title: string;
  excerpt?: string;
  category: string;
  publishedAt: string;
  slug: string;
  imageUrl?: string;
  sourceName?: string;
  readTime?: string;
}

interface HeroProps {
  articleCount?: number;
  featuredArticles?: Article[];
}

const categoryColors: Record<string, string> = {
  technology:    'bg-blue-500/20 text-blue-300',
  business:      'bg-purple-500/20 text-purple-300',
  entertainment: 'bg-pink-500/20 text-pink-300',
  science:       'bg-cyan-500/20 text-cyan-300',
  health:        'bg-green-500/20 text-green-300',
  lifestyle:     'bg-orange-500/20 text-orange-300',
  politics:      'bg-red-500/20 text-red-300',
};

function categoryBadge(cat: string) {
  const key = cat.toLowerCase();
  return categoryColors[key] ?? 'bg-gray-700/60 text-gray-300';
}

function formatDate(iso: string) {
  try { return format(parseISO(iso), 'MMM d, yyyy'); } catch { return ''; }
}

export default function Hero({ articleCount, featuredArticles = [] }: HeroProps) {
  const featured = featuredArticles[0];
  const secondary = featuredArticles.slice(1, 4);
  const hasArticles = Boolean(featured);

  return (
    <section className="bg-gradient-to-b from-gray-900 to-black">
      {/* ── Brand bar ─────────────────────────────────── */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Brand */}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-space text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
              >
                Trend Pulse
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="text-gray-400 mt-1"
              >
                Real-time news & trend analysis
              </motion.p>
            </div>

            {/* Stats strip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-6 text-sm"
            >
              <div className="flex items-center gap-1.5 text-gray-400">
                <Zap className="w-4 h-4 text-blue-400" />
                <span>24/7 coverage</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span>{articleCount ?? '50'}+ articles</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Category nav ──────────────────────────────── */}
      <div className="border-b border-gray-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex gap-1 overflow-x-auto scrollbar-none py-2"
          >
            {[
              { label: 'All News', href: '/articles' },
              { label: 'Technology', href: '/articles?category=technology' },
              { label: 'Business', href: '/articles?category=business' },
              { label: 'Entertainment', href: '/articles?category=entertainment' },
              { label: 'Science', href: '/articles?category=science' },
              { label: 'Health', href: '/articles?category=health' },
              { label: 'Lifestyle', href: '/articles?category=lifestyle' },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                {label}
              </Link>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Featured news ─────────────────────────────── */}
      {hasArticles && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Featured article — takes 2/3 width on desktop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Link href={`/article/${featured.slug}`} className="group block h-full">
                <div className="relative h-72 sm:h-96 lg:h-[440px] rounded-2xl overflow-hidden bg-gray-800">
                  <ArticleImage
                    article={featured}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    priority
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 backdrop-blur-sm ${categoryBadge(featured.category)}`}>
                      {featured.category}
                    </span>
                    <h2 className="font-space text-2xl sm:text-3xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors line-clamp-3">
                      {featured.title}
                    </h2>
                    {featured.excerpt && (
                      <p className="text-gray-300 text-sm line-clamp-2 mb-3 hidden sm:block">
                        {featured.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(featured.publishedAt)}
                      </span>
                      {featured.readTime && <span>{featured.readTime} read</span>}
                      <span className="flex items-center gap-1 text-blue-400 font-medium">
                        Read more <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Secondary articles — 1/3 width on desktop, stacked */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex flex-col gap-4"
            >
              {secondary.map((article, i) => (
                <Link
                  key={article.id}
                  href={`/article/${article.slug}`}
                  className="group flex gap-4 bg-gray-800/40 border border-gray-700/60 rounded-xl overflow-hidden hover:border-gray-600 transition-all"
                >
                  <div className="relative w-28 flex-shrink-0">
                    <ArticleImage
                      article={article}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="112px"
                    />
                  </div>
                  <div className="py-3 pr-3 flex flex-col justify-between min-w-0">
                    <div>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-1 ${categoryBadge(article.category)}`}>
                        {article.category}
                      </span>
                      <h3 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-3 leading-snug">
                        {article.title}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(article.publishedAt)}</p>
                  </div>
                </Link>
              ))}

              {/* View all link */}
              <Link
                href="/articles"
                className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-700 text-sm text-gray-400 hover:text-white hover:border-blue-500/40 hover:bg-gray-800/40 transition-all"
              >
                View all articles <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

          </div>
        </div>
      )}

      {/* Fallback when no articles yet */}
      {!hasArticles && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="text-gray-500">Loading latest news…</p>
        </div>
      )}
    </section>
  );
}
