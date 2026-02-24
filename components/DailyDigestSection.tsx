'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Eye, TrendingUp, Newspaper, Zap, ArrowRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { getArticleImage, getImageAltText } from '@/lib/images';

interface DailyDigest {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  views: number;
  trendingScore: number;
  tags: string[];
  publishedAt: string;
  publishedAtSite: string;
  color: string;
  breaking?: boolean;
  url: string;
  imageUrl: string;
  sourceName: string;
  slug: string;
  type: 'daily-digest';
}

export default function DailyDigestSection() {
  const [digest, setDigest] = useState<DailyDigest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDailyDigest = async () => {
      try {
        const response = await fetch('/api/articles?type=daily-digest&limit=1');
        const data = await response.json();
        
        if (data.success && data.data && data.data.length > 0) {
          setDigest(data.data[0]);
        }
      } catch (error) {
        console.error('Error fetching daily digest:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyDigest();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-48 mb-6"></div>
            <div className="h-64 bg-gray-800 rounded-xl mb-6"></div>
            <div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-800 rounded w-1/2"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!digest) {
    return null; // Don't show section if no digest exists
  }

  const publishedDate = parseISO(digest.publishedAt);
  const formattedDate = format(publishedDate, 'EEEE, MMMM d, yyyy');
  const dateSlug = digest.slug.replace('daily-digest-', '');

  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
              <Newspaper className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">
                Today&apos;s Daily Digest
              </h2>
              <p className="text-gray-400 mt-2">
                AI-powered summary of the top stories
              </p>
            </div>
          </div>
          
          <Link
            href="/daily-digest"
            className="hidden md:flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <span>View All Digests</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Digest Card */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10">
          <div className="md:flex">
            {/* Image */}
            <div className="md:w-2/5 relative h-64 md:h-auto">
              <Image
                src={getArticleImage(digest)}
                alt={getImageAltText(digest)}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r md:from-black/60 md:to-transparent" />
              
              {/* Badge */}
              <div className="absolute top-4 left-4">
                <span className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>AI Summary</span>
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="md:w-3/5 p-8">
              <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>{digest.views.toLocaleString()} views</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Trending Score: {digest.trendingScore}</span>
                </div>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                {digest.title}
              </h3>

              <p className="text-gray-300 mb-6">
                {digest.excerpt}
              </p>

              {/* Key Points (extracted from content) */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold mb-3 text-purple-300">
                  Today&apos;s Highlights
                </h4>
                <ul className="space-y-2">
                  {digest.content
                    .split('\n')
                    .filter(line => line.includes('•') || line.includes('-'))
                    .slice(0, 3)
                    .map((point, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                        <span className="text-gray-300">{point.replace(/[•\-]\s*/, '').trim()}</span>
                      </li>
                    ))}
                </ul>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={`/daily-digest/${dateSlug}`}
                  className="flex-1 py-3 px-6 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-center hover:opacity-90 transition-opacity"
                >
                  Read Full Digest
                </Link>
                <button className="flex-1 py-3 px-6 rounded-lg bg-gray-800 text-gray-300 font-semibold text-center hover:bg-gray-700 transition-colors border border-gray-700">
                  Share Summary
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View All Link */}
        <div className="mt-8 md:hidden text-center">
          <Link
            href="/daily-digest"
            className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <span>View All Daily Digests</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Benefits */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-gray-800/30 border border-gray-700">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <h4 className="text-lg font-semibold mb-2">AI-Powered Analysis</h4>
            <p className="text-gray-400">
              Get insights and context beyond basic summaries
            </p>
          </div>
          
          <div className="p-6 rounded-xl bg-gray-800/30 border border-gray-700">
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Trending Stories</h4>
            <p className="text-gray-400">
              Curated from the most important news of the day
            </p>
          </div>
          
          <div className="p-6 rounded-xl bg-gray-800/30 border border-gray-700">
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-purple-400" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Daily Delivery</h4>
            <p className="text-gray-400">
              Fresh digest published every day at 6 PM UTC
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}