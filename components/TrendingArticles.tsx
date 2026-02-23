'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, TrendingUp, Eye, DollarSign, ExternalLink, Zap, BarChart, Users } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import { getArticleImage, getImageAltText } from '@/lib/images';

// Type for API article
interface Article {
  id: number;
  title: string;
  excerpt: string;
  content?: string; // Make optional for fallback articles
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
}

// Fallback articles in case API fails
// We'll generate fallback articles dynamically to ensure varied images
const generateFallbackArticles = (): Article[] => {
  const fallbackTitles = [
    'AI Regulation Debate Intensifies: EU Proposes Stricter Rules for Generative AI',
    'Bitcoin Surges 15% Following ETF Approval: Market Analysis & Predictions',
    'Streaming Wars Escalate: New Platforms Challenge Netflix Dominance',
    'Sustainable Tech Investments Reach Record High in 2026',
    'Remote Work Revolution: How Companies Are Adapting Post-Pandemic',
    'Healthcare AI Breakthrough: New Diagnostic Tool Shows 95% Accuracy',
  ];
  
  const fallbackCategories = ['Tech', 'Finance', 'Entertainment', 'Business', 'Lifestyle', 'Health'];
  const fallbackExcerpts = [
    'European Commission announces new AI Act amendments targeting large language models. Tech giants express concerns over compliance costs.',
    'Cryptocurrency markets rally as SEC approves spot Bitcoin ETFs. Analysts predict continued growth with institutional adoption.',
    'New streaming services are gaining market share with niche content strategies. Traditional platforms face increasing competition.',
    'Venture capital funding for green technology startups has doubled year-over-year. Climate-focused innovation driving investment trends.',
    'Hybrid work models are becoming standard as companies balance productivity with employee preferences for flexibility.',
    'Artificial intelligence system demonstrates unprecedented accuracy in early disease detection. Medical community optimistic about potential.',
  ];
  
  return fallbackTitles.map((title, index) => ({
    id: index + 1,
    title,
    excerpt: fallbackExcerpts[index],
    content: '',
    category: fallbackCategories[index],
    readTime: `${Math.floor(Math.random() * 4) + 3} min`,
    views: Math.floor(Math.random() * 200) + 50, // Realistic for new site
    trendingScore: Math.floor(Math.random() * 20) + 80,
    tags: [
      ['AI Regulation', 'EU Policy', 'Tech Giants', 'Compliance'],
      ['Bitcoin', 'ETF', 'Cryptocurrency', 'Market Analysis'],
      ['Streaming', 'Entertainment', 'Media', 'Competition'],
      ['Sustainability', 'Investment', 'Technology', 'Climate'],
      ['Remote Work', 'Business', 'Productivity', 'Future of Work'],
      ['Healthcare', 'AI', 'Medical', 'Innovation']
    ][index],
    publishedAt: new Date(Date.now() - (index * 86400000)).toISOString(), // Stagger dates
    publishedAtSite: new Date(Date.now() - (index * 86400000)).toISOString(),
    color: [
      'from-blue-600 to-cyan-600',
      'from-purple-600 to-pink-600',
      'from-orange-600 to-red-600',
      'from-green-600 to-emerald-600',
      'from-indigo-600 to-blue-600',
      'from-pink-600 to-rose-600'
    ][index],
    breaking: index < 2, // First 2 articles are "breaking"
    url: '#',
    // Use getArticleImage for consistent image generation
    imageUrl: '', // Will be set by getArticleImage
    sourceName: 'Trend Pulse AI',
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  }));
};

const fallbackArticles = generateFallbackArticles();

const categories = [
  { name: 'All', count: 6, icon: Zap },
  { name: 'Tech', count: 2, icon: Zap },
  { name: 'Business', count: 1, icon: DollarSign },
  { name: 'Finance', count: 1, icon: TrendingUp },
  { name: 'Lifestyle', count: 1, icon: Users },
  { name: 'Health', count: 1, icon: Users },
];

// Helper function to get color based on category
const getColorForCategory = (category: string): string => {
  const colors: Record<string, string> = {
    technology: 'from-blue-600 to-cyan-600',
    tech: 'from-blue-600 to-cyan-600',
    business: 'from-purple-600 to-pink-600',
    finance: 'from-green-600 to-emerald-600',
    entertainment: 'from-orange-600 to-red-600',
    lifestyle: 'from-indigo-600 to-blue-600',
    general: 'from-pink-600 to-rose-600',
  };
  return colors[category?.toLowerCase()] || 'from-blue-600 to-cyan-600';
};

export default function TrendingArticles() {
  // Use function initializers for consistent SSR/CSR
  const [articles, setArticles] = useState<Article[]>(() => []);
  const [loading, setLoading] = useState(() => true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Simple fetch function with timeout - only runs on client
  useEffect(() => {
    let mounted = true;
    
    const fetchArticles = async () => {
      try {
        setLoading(true);
        
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch('/api/articles?limit=6', {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'no-cache',
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (mounted && data.success && data.data && data.data.length > 0) {
          // Transform API data to match our component format
          const transformedArticles = data.data.map((article: any, index: number) => ({
            id: article.id || index + 1,
            title: article.title || 'Untitled Article',
            excerpt: article.excerpt || article.content?.substring(0, 200) + '...' || 'No excerpt available',
            content: article.content || '',
            category: article.category ? article.category.charAt(0).toUpperCase() + article.category.slice(1) : 'General',
            readTime: article.readTime || '5 min',
            views: article.views || Math.floor(Math.random() * 50000) + 1000,
            trendingScore: article.trendingScore || Math.floor(Math.random() * 30) + 70,
            tags: article.tags || [article.category || 'News'],
            publishedAt: article.publishedAt || new Date().toISOString(),
            publishedAtSite: article.publishedAtSite || new Date().toISOString(),
            color: article.color || getColorForCategory(article.category),
            breaking: index < 2, // First 2 articles are "breaking"
            url: article.url || '#',
            imageUrl: article.imageUrl || '',
            sourceName: article.sourceName || 'Trend Pulse AI',
            slug: article.slug || article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          }));
          
          setArticles(transformedArticles);
        }
      } catch (err) {
        console.error('Error fetching articles:', err);
        // Keep fallback articles if fetch fails
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Fetch after a short delay to ensure page loads first
    const timer = setTimeout(() => {
      fetchArticles();
    }, 100);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);

  // Show fallback articles immediately while loading
  const displayArticles = articles;

  return (
    <section className="py-16 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-space text-3xl sm:text-4xl font-bold text-white"
              >
                Latest News
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-gray-400 mt-2"
              >
                {loading ? 'Loading articles...' : 'Latest news updated continuously'}
              </motion.p>
            </div>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-sm text-blue-300">Live updates</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-3 justify-center mb-12"
        >
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.name}
                className="group flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 border border-gray-700 hover:border-blue-500/30 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 transition-all"
              >
                <Icon className="w-4 h-4 text-gray-400 group-hover:text-white" />
                <span className="font-medium text-gray-300 group-hover:text-white">{category.name}</span>
                <span className="text-xs text-gray-500 group-hover:text-gray-400">({category.count})</span>
              </button>
            );
          })}
        </motion.div>

        {/* Articles grid - Clean Joe.ie style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayArticles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index }}
              className="group"
            >
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden hover:border-gray-600 transition-all h-full">
                {/* Article Image */}
                <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                  <Image
                    src={getArticleImage(article)}
                    alt={getImageAltText(article)}
                    width={400}
                    height={225}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Category badge overlay */}
                  <div className="absolute top-3 left-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${article.category === 'Technology' ? 'bg-blue-500/20 text-blue-300 backdrop-blur-sm' : article.category === 'Business' ? 'bg-purple-500/20 text-purple-300 backdrop-blur-sm' : article.category === 'Entertainment' ? 'bg-pink-500/20 text-pink-300 backdrop-blur-sm' : 'bg-gray-800/80 text-gray-300 backdrop-blur-sm'}`}>
                      {article.category}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  {/* Title - Clean and simple */}
                  <h3 className="font-medium text-lg text-white mb-3 group-hover:text-blue-300 transition-colors line-clamp-3">
                    <Link href={`/article/${article.slug}`}>{article.title}</Link>
                  </h3>

                  {/* Excerpt - Clean and concise */}
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">{article.excerpt}</p>

                  {/* Simple metadata */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {format(parseISO(article.publishedAt), 'MMM d')}
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{article.trendingScore}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
}