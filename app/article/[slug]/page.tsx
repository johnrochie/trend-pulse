import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Eye, TrendingUp, ExternalLink, ArrowLeft, Share2, Bookmark } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { getArticles } from '@/lib/api';
import { getArticleImage, getImageAltText } from '@/lib/images';
import { generateCanonicalUrl, generateOpenGraphTags, generateTwitterCardTags, generateNewsArticleSchema } from '@/lib/seo';
import { config } from '@/lib/config';
import RelatedArticles from '@/components/RelatedArticles';

interface Article {
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
}

async function getArticle(slug: string): Promise<Article | null> {
  try {
    // Fetch from our API using the utility
    const data = await getArticles({ slug });
    
    if (data.success && data.data && data.data.length > 0) {
      return data.data[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

// Generate metadata for the article page
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  
  if (!article) {
    return {
      title: 'Article Not Found - Trend Pulse',
      description: 'The requested article could not be found.',
    };
  }
  
  // Use SEO-enhanced data from API if available, otherwise generate
  const title = article.seoTitle || `${article.title} | ${article.category} News - Trend Pulse`;
  const description = article.metaDescription || article.excerpt || `Read our latest ${article.category} news: ${article.title}. Stay informed with Trend Pulse.`;
  const canonicalUrl = article.canonicalUrl || generateCanonicalUrl(`/article/${article.slug}`);
  const imageUrl = article.ogImage || article.imageUrl || `${config.site.url}/og-image.jpg`;
  
  // Generate Open Graph and Twitter tags
  const ogTags = generateOpenGraphTags(title, description, imageUrl, `/article/${article.slug}`);
  const twitterTags = generateTwitterCardTags(title, description, imageUrl);
  
  return {
    title,
    description: description.substring(0, 160), // Keep within meta description limits
    keywords: article.tags?.join(', ') || article.category,
    authors: [{ name: 'Trend Pulse' }],
    metadataBase: new URL(config.site.url),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      ...ogTags,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || article.publishedAt,
      authors: ['Trend Pulse'],
      tags: article.tags || [article.category],
    },
    twitter: {
      ...twitterTags,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  
  if (!article) {
    notFound();
  }
  
  // Generate structured data for SEO
  const structuredData = generateNewsArticleSchema(
    article.title,
    article.excerpt || article.metaDescription || `Read our latest ${article.category} news and analysis.`,
    article.imageUrl || `${config.site.url}/og-image.jpg`,
    article.publishedAt,
    article.updatedAt || article.publishedAt,
    'Trend Pulse'
  );
  
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
  
  const categoryColor = getColorForCategory(article.category);
  
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-white transition-colors" aria-label="Bookmark">
                <Bookmark className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors" aria-label="Share">
                <Share2 className="w-5 h-5" />
              </button>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${categoryColor} text-white`}>
                {article.category}
              </span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Article Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar className="w-4 h-4" />
              {format(parseISO(article.publishedAt), 'MMMM d, yyyy')}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Eye className="w-4 h-4" />
              {article.views.toLocaleString()} views
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <TrendingUp className="w-4 h-4" />
              {article.trendingScore} trending score
            </div>
          </div>
          
          <h1 className="font-space text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            {article.title}
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            {article.excerpt}
          </p>
        </div>
        
        {/* Hero Image */}
        <div className="mb-12 rounded-xl overflow-hidden">
          <div className="relative h-64 md:h-96 w-full bg-gradient-to-br from-gray-800 to-gray-900">
            <Image
              src={getArticleImage(article)}
              alt={getImageAltText(article)}
              width={1200}
              height={600}
              className="w-full h-full object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute bottom-4 left-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gray-900/80 backdrop-blur-sm text-white`}>
                {article.category}
              </span>
            </div>
          </div>
          <div className="bg-gray-800/50 p-4 text-sm text-gray-400 italic">
            Image: {article.category} news illustration
          </div>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-sm hover:bg-gray-700 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        
        {/* Article Content */}
        <div className="prose prose-lg prose-invert max-w-none">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 mb-8">
            <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
              {article.content || (
                <div className="space-y-4">
                  <p>This is a sample article content. In a real implementation, this would be the full AI-generated content from our automation system.</p>
                  <p>The automation system generates 800-1200 word articles on trending topics from NewsAPI. Each article is unique and optimized for SEO and reader engagement.</p>
                  <p>Topics covered include technology, business, finance, entertainment, and lifestyle trends.</p>
                  <p>Articles are generated automatically every 6 hours, ensuring fresh content is always available for readers.</p>
                  <h3 className="text-2xl font-bold text-white mt-8 mb-4">Key Features of Our AI Content:</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>800-1200 words per article</li>
                    <li>SEO-optimized structure</li>
                    <li>Real-time trend analysis</li>
                    <li>Multiple revenue streams integrated</li>
                    <li>Automatic publishing every 6 hours</li>
                  </ul>
                  <p className="mt-8">This article was generated by our AI system and is part of our automated content pipeline that produces fresh news and analysis daily.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Article Insights */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 mb-12">
          <h3 className="font-space text-2xl font-bold text-white mb-6">Article Insights</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center p-6 bg-gray-900 rounded-xl">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {article.views.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Total Views</div>
            </div>
            
            <div className="text-center p-6 bg-gray-900 rounded-xl">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {article.readTime}
              </div>
              <div className="text-sm text-gray-400">Read Time</div>
            </div>
            
            <div className="text-center p-6 bg-gray-900 rounded-xl">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {article.trendingScore}
              </div>
              <div className="text-sm text-gray-400">Trending Score</div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8">
            <h4 className="font-bold text-white mb-4">About This Content</h4>
            <div className="space-y-4">
              <p className="text-gray-300">
                This article was prepared by our news team, which continuously monitors 
                trending topics to deliver comprehensive, well-researched content.
              </p>
              <p className="text-gray-300">
                We analyze multiple news sources to provide balanced perspectives and 
                up-to-date information on emerging stories.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span>Real-time coverage</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span>Multiple source analysis</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                <span>Quality assurance</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Articles (Internal Linking for SEO) */}
        <RelatedArticles
          currentArticleId={article.id}
          currentCategory={article.category}
          currentTags={article.tags}
          limit={3}
        />
        
        {/* CTA Section */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl font-semibold text-lg transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to All Articles
          </Link>
          <p className="text-gray-500 text-sm mt-4">
            Discover more trending news and analysis on our homepage
          </p>
        </div>
      </main>
      
      {/* Footer Note */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-gray-800">
        <div className="text-center text-gray-500 text-sm">
          <p>© 2026 Trend Pulse. AI-powered real-time news and trend analysis.</p>
          <p className="mt-2">
            Delivering timely news coverage through automated systems.
            <a href="/about" className="text-blue-400 hover:text-blue-300 ml-1">
              Learn about our approach →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}