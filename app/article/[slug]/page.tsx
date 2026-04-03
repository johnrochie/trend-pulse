import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fetchArticles } from '@/lib/articles-api';
import { getImageAltText } from '@/lib/images';
import ArticleImage from '@/components/ArticleImage';
import { generateCanonicalUrl, generateOpenGraphTags, generateTwitterCardTags, generateNewsArticleSchemaWithUrl, generateBreadcrumbSchemaFromItems } from '@/lib/seo';
import { generateAiArticleSchema, generateAiFaqSchema, generateAiOptimizedContent } from '@/lib/ai-search';
import { config } from '@/lib/config';
import RelatedArticles from '@/components/RelatedArticles';
import Breadcrumbs from '@/components/Breadcrumbs';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import ArticleActions from '@/components/ArticleActions';

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
  // SEO fields (added by API enhancement)
  seoTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  updatedAt?: string;
}

/**
 * Strip source name suffix from article titles (e.g. "Story - IGN" → "Story")
 * NewsAPI often appends the source name to the title with " - " or " | "
 */
function cleanTitle(title: string, sourceName?: string): string {
  if (!title) return title;
  // If we have the exact source name, try to strip it specifically
  if (sourceName) {
    const suffixDash = ` - ${sourceName}`;
    const suffixPipe = ` | ${sourceName}`;
    if (title.endsWith(suffixDash)) return title.slice(0, -suffixDash.length).trim();
    if (title.endsWith(suffixPipe)) return title.slice(0, -suffixPipe.length).trim();
  }
  // Generic: if the last segment after " - " or " | " looks like a source name
  // (short, ≤40 chars, no sentence structure), strip it
  const dashParts = title.split(' - ');
  if (dashParts.length >= 2) {
    const lastPart = dashParts[dashParts.length - 1];
    if (lastPart.length <= 40 && !lastPart.includes(' the ') && !lastPart.includes(' and ')) {
      return dashParts.slice(0, -1).join(' - ').trim();
    }
  }
  return title;
}

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const response = await fetchArticles({ slug, limit: 1 });
    if (response.success && response.data?.length > 0) {
      return response.data[0];
    }
    return null;
  } catch {
    return null;
  }
}

// ISR: Revalidate cached article pages every hour for fresher content
export const revalidate = 300;

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
  const cleanedTitle = cleanTitle(article.title, article.sourceName);
  const title = article.seoTitle || `${cleanedTitle} | ${article.category} News - Trend Pulse`;
  const description = article.metaDescription || article.excerpt || `Read our latest ${article.category} news: ${article.title}. Stay informed with Trend Pulse.`;
  const canonicalUrl = article.canonicalUrl || generateCanonicalUrl(`/article/${article.slug}`);
  const rawImage = article.ogImage || article.imageUrl;
  const imageUrl = rawImage && rawImage.startsWith('http')
    ? rawImage
    : `${config.site.url}/og-image.jpg`;
  
  // Generate Open Graph and Twitter tags
  const ogTags = generateOpenGraphTags(title, description, imageUrl, `/article/${article.slug}`);
  const twitterTagsObj = generateTwitterCardTags(title, description, imageUrl);
  
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
      card: 'summary_large_image' as const,
      site: '@trendpulse',
      creator: '@trendpulse',
      title: title,
      description: description.substring(0, 200),
      images: [imageUrl],
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

/**
 * Strips the automation-added AI footer from article content before rendering.
 * The footer starts at the `---` separator followed by the AI attribution line.
 * Source info is already available as structured fields (sourceName, url) so
 * we render it as a proper attribution block instead.
 */
function stripAiFooter(content: string): string {
  return content.replace(/\n+---\n+\*Article generated by AI[^]*$/i, '').trim();
}

async function getRelatedArticles(article: Article, limit: number = 3) {
  const response = await fetchArticles({
    category: article.category,
    limit: limit + 5,
  });
  if (!response.success || !response.data?.length) return [];
  return response.data
    .filter((a) => a.id !== article.id && a.slug !== article.slug)
    .slice(0, limit)
    .map((a) => ({
      id: a.id,
      title: a.title,
      excerpt: a.excerpt,
      category: a.category,
      readTime: a.readTime,
      views: a.views ?? 0,
      trendingScore: a.trendingScore ?? 0,
      publishedAt: a.publishedAt,
      slug: a.slug,
      imageUrl: a.imageUrl,
    }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const relatedArticles = await getRelatedArticles(article, 3);
  
  // Generate structured data for SEO (with article URL for mainEntityOfPage)
  const articleUrl = `${config.site.url}/article/${article.slug}`;
  const articleImageUrl = (() => {
    const img = article.ogImage || article.imageUrl;
    return img && img.startsWith('http') ? img : getArticleImage(article);
  })();
  const structuredData = generateNewsArticleSchemaWithUrl(
    article.title,
    article.excerpt || article.metaDescription || `Read our latest ${article.category} news and analysis.`,
    articleImageUrl,
    article.publishedAt,
    article.updatedAt || article.publishedAt,
    articleUrl,
    'Trend Pulse'
  );
  
  // Generate AI search optimized schema
  const aiArticleSchema = generateAiArticleSchema(
    article.title,
    article.excerpt || article.metaDescription || `Read our latest ${article.category} news and analysis.`,
    article.content || generateAiOptimizedContent(article.category, article.title),
    article.publishedAt,
    article.updatedAt || article.publishedAt
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
  const displayTitle = cleanTitle(article.title, article.sourceName);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* AI search optimized structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aiArticleSchema) }}
      />
      {/* Breadcrumb structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbSchemaFromItems([
              { name: 'Home', url: '/' },
              { name: 'Articles', url: '/articles' },
              { name: article.title, url: `/article/${article.slug}` },
            ])
          ),
        }}
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
              <ArticleActions title={article.title} url={`/article/${article.slug}`} />
              <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${categoryColor} text-white`}>
                {article.category}
              </span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Articles', href: '/articles' },
            { label: displayTitle },
          ]}
        />
        <div className="mb-12">
          <h1 className="font-space text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            {displayTitle}
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            {article.excerpt}
          </p>
        </div>
        
        {/* Hero Image */}
        <div className="mb-12 rounded-xl overflow-hidden">
          <div className="relative h-64 md:h-96 w-full bg-gradient-to-br from-gray-800 to-gray-900">
            <ArticleImage
              article={article}
              width={1200}
              height={600}
              className="w-full h-full object-cover"
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
            <div className="absolute bottom-4 left-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gray-900/80 backdrop-blur-sm text-white`}>
                {article.category}
              </span>
            </div>
          </div>
          <figure className="bg-gray-800/50 p-4 text-sm text-gray-400 italic">
            <figcaption>{getImageAltText(article)}</figcaption>
          </figure>
        </div>
        
        {/* Tags */}
        {Array.isArray(article.tags) && article.tags.length > 0 && (
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
        )}
        
        {/* Article Content */}
        <div className="prose prose-lg prose-invert max-w-none">
          <article className="bg-gray-800 border border-gray-700 rounded-2xl p-8 mb-8">
            {article.content ? (
              <MarkdownRenderer content={stripAiFooter(article.content)} />
            ) : (
              <div className="text-gray-400 text-center py-12">
                <p>Content is being prepared. Check back soon for the full article.</p>
                <p className="text-sm mt-2">In the meantime, explore more stories in the related articles below.</p>
              </div>
            )}
          </article>
        </div>

        {/* Source Attribution */}
        {article.sourceName && article.url && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 mb-8 flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-300 mb-1">Original Reporting</p>
              <p className="text-sm text-gray-400">
                This analysis draws on original reporting by{' '}
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline transition-colors"
                >
                  {article.sourceName}
                </a>
                . Visit the source for the original story.
              </p>
            </div>
          </div>
        )}
        
        {/* Article Insights */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 mb-12">
          <h3 className="font-space text-2xl font-bold text-white mb-6">Article Insights</h3>
          
          <div className="flex justify-center mb-8">
            <div className="text-center p-6 bg-gray-900 rounded-xl min-w-[140px]">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {article.readTime}
              </div>
              <div className="text-sm text-gray-400">Read Time</div>
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
          articles={relatedArticles}
          currentCategory={article.category}
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