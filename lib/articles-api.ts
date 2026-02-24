/**
 * Articles API Service for Trend Pulse
 * 
 * Fetches articles from multiple possible sources:
 * 1. GitHub (primary for Vercel deployment)
 * 2. Local files (development)
 * 3. Fallback mock data (if all else fails)
 */

import { config } from './config';

export interface Article {
  id: number;
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
  // SEO fields
  seoTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  updatedAt?: string;
}

export interface ApiResponse {
  success: boolean;
  data: Article[];
  meta: {
    count: number;
    lastUpdated: string;
    source: string;
    filteredCount?: number;
    appliedFilters?: any;
  };
  error?: string;
}

/**
 * Fetch articles from the best available source
 */
export async function fetchArticles(options: {
  limit?: number;
  category?: string;
  id?: number;
  slug?: string;
  type?: string;
} = {}): Promise<ApiResponse> {
  const { limit = 50, category, id, slug, type } = options;
  
  try {
    // Try GitHub first (for Vercel deployment)
    const githubData = await fetchFromGitHub();
    if (githubData.success && githubData.data.length > 0) {
      console.log('Articles loaded from GitHub');
      return filterArticles(githubData, { limit, category, id, slug, type });
    }
    
    // Try local files (for development)
    const localData = await fetchFromLocalFiles();
    if (localData.success && localData.data.length > 0) {
      console.log('Articles loaded from local files');
      return filterArticles(localData, { limit, category, id, slug, type });
    }
    
    // Fallback to mock data
    console.log('Using fallback mock articles');
    return getMockArticles({ limit, category, id, slug, type });
    
  } catch (error) {
    console.error('Error fetching articles:', error);
    return getMockArticles({ limit, category, id, slug, type });
  }
}

/**
 * Fetch articles from GitHub (for Vercel deployment)
 */
async function fetchFromGitHub(): Promise<ApiResponse> {
  try {
    // GitHub raw URL for automation-output.json
    const githubUrl = 'https://raw.githubusercontent.com/johnrochie/trend-pulse/main/automation-output.json';
    
    const response = await fetch(githubUrl, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      throw new Error(`GitHub fetch failed: ${response.status}`);
    }
    
    const articles = await response.json();
    
    return {
      success: true,
      data: Array.isArray(articles) ? articles : articles.articles || [],
      meta: {
        count: Array.isArray(articles) ? articles.length : articles.articles?.length || 0,
        lastUpdated: new Date().toISOString(),
        source: 'GitHub'
      }
    };
    
  } catch (error) {
    console.error('GitHub fetch failed:', error);
    return {
      success: false,
      data: [],
      meta: {
        count: 0,
        lastUpdated: new Date().toISOString(),
        source: 'GitHub (failed)'
      },
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Fetch articles from local files (for development)
 */
async function fetchFromLocalFiles(): Promise<ApiResponse> {
  try {
    // This will only work in Node.js environment (development)
    if (typeof window !== 'undefined') {
      throw new Error('Local file access not available in browser');
    }
    
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const articlesPath = config.automation.articlesPath;
    const content = await fs.readFile(articlesPath, 'utf-8');
    const data = JSON.parse(content);
    
    return {
      success: true,
      data: Array.isArray(data) ? data : data.articles || [],
      meta: {
        count: Array.isArray(data) ? data.length : data.articles?.length || 0,
        lastUpdated: new Date().toISOString(),
        source: 'Local files'
      }
    };
    
  } catch (error) {
    console.error('Local file fetch failed:', error);
    return {
      success: false,
      data: [],
      meta: {
        count: 0,
        lastUpdated: new Date().toISOString(),
        source: 'Local files (failed)'
      },
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Get mock articles for fallback
 */
function getMockArticles(options: {
  limit?: number;
  category?: string;
  id?: number;
  slug?: string;
  type?: string;
} = {}): ApiResponse {
  const mockArticles: Article[] = [
    {
      id: 1,
      title: 'AI News Automation: The Future of Content Creation',
      excerpt: 'How AI-powered systems are revolutionizing news reporting and content generation across industries.',
      content: 'Artificial intelligence is transforming how news is created and distributed. Automated systems can now monitor breaking news, analyze trends, and generate comprehensive articles in minutes. This technology enables 24/7 coverage with consistent quality and rapid response times.',
      category: 'Technology',
      readTime: '4 min',
      views: 12500,
      trendingScore: 95,
      tags: ['AI', 'Automation', 'News', 'Technology', 'Innovation'],
      publishedAt: new Date().toISOString(),
      publishedAtSite: 'Trend Pulse',
      color: 'from-blue-600 to-cyan-600',
      url: '/article/ai-news-automation-future-content-creation',
      imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=450&fit=crop&crop=entropy&q=80&auto=format',
      sourceName: 'Trend Pulse Analysis',
      slug: 'ai-news-automation-future-content-creation',
      seoTitle: 'AI News Automation: The Future of Content Creation | Technology News - Trend Pulse',
      metaDescription: 'How AI-powered systems are revolutionizing news reporting and content generation across industries. Read our latest technology news and analysis.',
      canonicalUrl: 'https://trendpulse.life/article/ai-news-automation-future-content-creation',
      ogImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=450&fit=crop&crop=entropy&q=80&auto=format',
      updatedAt: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Market Trends 2026: What Investors Need to Know',
      excerpt: 'Analysis of emerging market trends and investment opportunities for the coming year.',
      content: 'The financial landscape is evolving rapidly with new technologies and shifting consumer behaviors. Key trends include sustainable investing, AI-driven analytics, and decentralized finance. Investors should focus on long-term growth sectors while maintaining diversified portfolios.',
      category: 'Business',
      readTime: '5 min',
      views: 8900,
      trendingScore: 87,
      tags: ['Finance', 'Investing', 'Markets', 'Trends', 'Economy'],
      publishedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      publishedAtSite: 'Trend Pulse',
      color: 'from-purple-600 to-pink-600',
      url: '/article/market-trends-2026-what-investors-need-to-know',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop&crop=entropy&q=80&auto=format',
      sourceName: 'Trend Pulse Analysis',
      slug: 'market-trends-2026-what-investors-need-to-know',
      seoTitle: 'Market Trends 2026: What Investors Need to Know | Business News - Trend Pulse',
      metaDescription: 'Analysis of emerging market trends and investment opportunities for the coming year. Stay informed with our latest business news coverage.',
      canonicalUrl: 'https://trendpulse.life/article/market-trends-2026-what-investors-need-to-know',
      ogImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop&crop=entropy&q=80&auto=format',
      updatedAt: new Date().toISOString()
    },
    {
      id: 3,
      title: 'Streaming Wars Intensify: New Platforms Challenge Established Giants',
      excerpt: 'The battle for streaming dominance heats up as new entrants disrupt the entertainment landscape.',
      content: 'The streaming industry is experiencing unprecedented competition with new platforms launching monthly. Established players like Netflix and Disney+ face challenges from niche services and global expansions. Content quality and pricing strategies are key differentiators in this crowded market.',
      category: 'Entertainment',
      readTime: '3 min',
      views: 11200,
      trendingScore: 92,
      tags: ['Streaming', 'Entertainment', 'Media', 'Technology', 'Business'],
      publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      publishedAtSite: 'Trend Pulse',
      color: 'from-orange-600 to-red-600',
      url: '/article/streaming-wars-intensify-new-platforms-challenge-established-giants',
      imageUrl: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&h=450&fit=crop&crop=entropy&q=80&auto=format',
      sourceName: 'Trend Pulse Analysis',
      slug: 'streaming-wars-intensify-new-platforms-challenge-established-giants',
      seoTitle: 'Streaming Wars Intensify: New Platforms Challenge Established Giants | Entertainment News - Trend Pulse',
      metaDescription: 'The battle for streaming dominance heats up as new entrants disrupt the entertainment landscape. Read our latest entertainment news analysis.',
      canonicalUrl: 'https://trendpulse.life/article/streaming-wars-intensify-new-platforms-challenge-established-giants',
      ogImage: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&h=450&fit=crop&crop=entropy&q=80&auto=format',
      updatedAt: new Date().toISOString()
    },
    {
      id: 4,
      title: 'Wellness Trends: How Technology is Transforming Health',
      excerpt: 'From wearable devices to mental health apps, technology is reshaping personal wellness.',
      content: 'The wellness industry is embracing technology at an unprecedented pace. Wearable devices now track everything from sleep patterns to stress levels, while AI-powered apps provide personalized health recommendations. This convergence of health and technology is creating new opportunities for preventive care and personalized medicine.',
      category: 'Lifestyle',
      readTime: '4 min',
      views: 7600,
      trendingScore: 84,
      tags: ['Health', 'Wellness', 'Technology', 'Lifestyle', 'Innovation'],
      publishedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      publishedAtSite: 'Trend Pulse',
      color: 'from-indigo-600 to-blue-600',
      url: '/article/wellness-trends-how-technology-is-transforming-health',
      imageUrl: 'https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?w=800&h=450&fit=crop&crop=entropy&q=80&auto=format',
      sourceName: 'Trend Pulse Analysis',
      slug: 'wellness-trends-how-technology-is-transforming-health',
      seoTitle: 'Wellness Trends: How Technology is Transforming Health | Lifestyle News - Trend Pulse',
      metaDescription: 'From wearable devices to mental health apps, technology is reshaping personal wellness. Stay informed with our latest lifestyle trends analysis.',
      canonicalUrl: 'https://trendpulse.life/article/wellness-trends-how-technology-is-transforming-health',
      ogImage: 'https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?w=800&h=450&fit=crop&crop=entropy&q=80&auto=format',
      updatedAt: new Date().toISOString()
    },
    {
      id: 5,
      title: 'Sustainable Finance: Green Investments Reach Record High',
      excerpt: 'Environmental, social, and governance (ESG) investing continues to gain momentum globally.',
      content: 'Sustainable finance has moved from niche to mainstream, with ESG-focused funds attracting record inflows. Investors are increasingly considering climate risk and social impact alongside financial returns. This shift is driving innovation in green bonds, carbon credits, and impact measurement.',
      category: 'Finance',
      readTime: '5 min',
      views: 9400,
      trendingScore: 89,
      tags: ['ESG', 'Sustainability', 'Finance', 'Investing', 'Climate'],
      publishedAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
      publishedAtSite: 'Trend Pulse',
      color: 'from-green-600 to-emerald-600',
      url: '/article/sustainable-finance-green-investments-reach-record-high',
      imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=450&fit=crop&crop=entropy&q=80&auto=format',
      sourceName: 'Trend Pulse Analysis',
      slug: 'sustainable-finance-green-investments-reach-record-high',
      seoTitle: 'Sustainable Finance: Green Investments Reach Record High | Finance News - Trend Pulse',
      metaDescription: 'Environmental, social, and governance (ESG) investing continues to gain momentum globally. Read our latest finance news and analysis.',
      canonicalUrl: 'https://trendpulse.life/article/sustainable-finance-green-investments-reach-record-high',
      ogImage: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=450&fit=crop&crop=entropy&q=80&auto=format',
      updatedAt: new Date().toISOString()
    },
    {
      id: 6,
      title: 'Remote Work Revolution: Hybrid Models Reshape Corporate Culture',
      excerpt: 'Companies worldwide are adopting flexible work arrangements to attract and retain talent.',
      content: 'The shift to remote and hybrid work is fundamentally changing how organizations operate. Companies are redesigning office spaces, implementing new collaboration tools, and rethinking performance metrics. This transformation presents both challenges and opportunities for productivity, innovation, and employee wellbeing.',
      category: 'Lifestyle',
      readTime: '4 min',
      views: 10200,
      trendingScore: 91,
      tags: ['Remote Work', 'Hybrid', 'Corporate Culture', 'Productivity', 'Future of Work'],
      publishedAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
      publishedAtSite: 'Trend Pulse',
      color: 'from-pink-600 to-rose-600',
      url: '/article/remote-work-revolution-hybrid-models-reshape-corporate-culture',
      imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=450&fit=crop&crop=entropy&q=80&auto=format',
      sourceName: 'Trend Pulse Analysis',
      slug: 'remote-work-revolution-hybrid-models-reshape-corporate-culture',
      seoTitle: 'Remote Work Revolution: Hybrid Models Reshape Corporate Culture | Lifestyle News - Trend Pulse',
      metaDescription: 'Companies worldwide are adopting flexible work arrangements to attract and retain talent. Stay informed with our latest lifestyle trends analysis.',
      canonicalUrl: 'https://trendpulse.life/article/remote-work-revolution-hybrid-models-reshape-corporate-culture',
      ogImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=450&fit=crop&crop=entropy&q=80&auto=format',
      updatedAt: new Date().toISOString()
    }
  ];

  let filtered = mockArticles;

  if (options.id) {
    filtered = filtered.filter(article => article.id === options.id);
  }

  if (options.slug) {
    filtered = filtered.filter(article => article.slug === options.slug);
  }

  if (options.category) {
    filtered = filtered.filter(article => 
      article.category.toLowerCase() === options.category!.toLowerCase()
    );
  }

  filtered = filtered.slice(0, options.limit || 50);

  return {
    success: true,
    data: filtered,
    meta: {
      count: filtered.length,
      lastUpdated: new Date().toISOString(),
      source: 'Mock data',
      filteredCount: filtered.length,
      appliedFilters: options
    }
  };
}

/**
 * Filter articles based on options
 */
function filterArticles(
  response: ApiResponse,
  options: {
    limit?: number;
    category?: string;
    id?: number;
    slug?: string;
    type?: string;
  }
): ApiResponse {
  let filtered = response.data;

  if (options.id) {
    filtered = filtered.filter(article => article.id === options.id);
  }

  if (options.slug) {
    filtered = filtered.filter(article => 
      article.slug?.toLowerCase() === options.slug!.toLowerCase()
    );
  }

  if (options.category) {
    filtered = filtered.filter(article => 
      article.category?.toLowerCase() === options.category!.toLowerCase()
    );
  }

  if (options.type) {
    filtered = filtered.filter(article => 
      (article as any).type?.toLowerCase() === options.type!.toLowerCase()
    );
  }

  filtered = filtered.slice(0, options.limit || 50);

  return {
    ...response,
    data: filtered,
    meta: {
      ...response.meta,
      filteredCount: filtered.length,
      appliedFilters: options
    }
  };
}

/**
 * Get a single article by slug
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const response = await fetchArticles({ slug, limit: 1 });
  
  if (response.success && response.data.length > 0) {
    return response.data[0];
  }
  
  return null;
}

/**
 * Get articles by category
 */
export async function getArticlesByCategory(category: string, limit: number = 10): Promise<Article[]> {
  const response = await fetchArticles({ category, limit });
  return response.data;
}

/**
 * Get latest articles
 */
export async function getLatestArticles(limit: number = 10): Promise<Article[]> {
  const response = await fetchArticles({ limit });
  return response.data;
}