'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Eye, TrendingUp, ArrowRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { getArticles } from '@/lib/api';
import { getArticleImage, getImageAltText } from '@/lib/images';

interface Article {
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
  currentArticleId: number;
  currentCategory: string;
  currentTags?: string[];
  limit?: number;
}

export default function RelatedArticles({ 
  currentArticleId, 
  currentCategory, 
  currentTags = [], 
  limit = 3 
}: RelatedArticlesProps) {
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRelatedArticles() {
      try {
        setLoading(true);
        
        // Fetch articles from the same category
        const response = await getArticles({ 
          category: currentCategory,
          limit: limit + 2 // Fetch extra to filter out current article
        });
        
        if (response.success && response.data) {
          // Filter out current article and limit results
          const filtered = response.data
            .filter((article: Article) => article.id !== currentArticleId)
            .slice(0, limit);
          
          setRelatedArticles(filtered);
        }
      } catch (error) {
        console.error('Error fetching related articles:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRelatedArticles();
  }, [currentArticleId, currentCategory, limit]);

  if (loading) {
    return (
      <div className="mt-12">
        <h3 className="font-space text-2xl font-bold text-white mb-6">Related Articles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-800 rounded-xl h-48 mb-4"></div>
              <div className="h-4 bg-gray-800 rounded mb-2"></div>
              <div className="h-3 bg-gray-800 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-space text-2xl font-bold text-white">Related Articles</h3>
        <Link 
          href={`/category/${currentCategory.toLowerCase()}`}
          className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
        >
          View all {currentCategory} articles
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedArticles.map((article) => (
          <Link
            key={article.id}
            href={`/article/${article.slug}`}
            className="group block bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all"
          >
            {/* Article Image */}
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
            
            {/* Article Content */}
            <div className="p-5">
              <h4 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                {article.title}
              </h4>
              
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                {article.excerpt}
              </p>
              
              {/* Article Meta */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(parseISO(article.publishedAt), 'MMM d')}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {article.views.toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {article.trendingScore}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Internal linking note for SEO */}
      <div className="mt-6 p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
        <p className="text-sm text-gray-400">
          <span className="font-semibold text-blue-400">SEO Tip:</span> Internal linking between related articles 
          helps search engines understand your site structure and improves user engagement. 
          Each article should link to 2-3 related pieces of content.
        </p>
      </div>
    </div>
  );
}