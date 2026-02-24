import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Eye, TrendingUp, ExternalLink, ArrowLeft, Share2, Bookmark, Newspaper, Zap, Globe, TrendingUp as TrendingUpIcon, Lightbulb } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { getArticles } from '@/lib/api';
import { getArticleImage, getImageAltText } from '@/lib/images';
import { generateCanonicalUrl, generateOpenGraphTags, generateTwitterCardTags } from '@/lib/seo';
import { config } from '@/lib/config';

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

async function getDailyDigest(date: string): Promise<DailyDigest | null> {
  try {
    // Fetch from our API using the utility
    const data = await getArticles({ type: 'daily-digest' });
    
    if (data.success && data.data && data.data.length > 0) {
      // Find digest with matching date slug
      const digest = data.data.find((article: any) => 
        article.type === 'daily-digest' && article.slug === `daily-digest-${date}`
      );
      
      return digest || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching daily digest:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { date: string } }): Promise<Metadata> {
  const digest = await getDailyDigest(params.date);
  
  if (!digest) {
    return {
      title: 'Daily Digest Not Found',
      description: 'The requested daily digest could not be found.',
    };
  }
  
  const siteUrl = config.site.url;
  const canonical = `${siteUrl}/daily-digest/${params.date}`;
  
  return {
    title: digest.title,
    description: digest.excerpt,
    keywords: ['daily digest', 'news summary', 'AI analysis', ...(digest.tags || [])].join(', '),
    authors: [{ name: 'Trend Pulse AI' }],
    openGraph: {
      title: digest.title,
      description: digest.excerpt,
      type: 'article',
      publishedTime: digest.publishedAt,
      authors: ['Trend Pulse AI'],
      tags: digest.tags,
      images: [
        {
          url: digest.imageUrl,
          width: 1200,
          height: 630,
          alt: getImageAltText(digest),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: digest.title,
      description: digest.excerpt,
      images: [digest.imageUrl],
    },
    alternates: {
      canonical: canonical,
    },
  };
}

export default async function DailyDigestPage({ params }: { params: { date: string } }) {
  const digest = await getDailyDigest(params.date);
  
  if (!digest) {
    notFound();
  }
  
  const publishedDate = parseISO(digest.publishedAt);
  const formattedDate = format(publishedDate, 'EEEE, MMMM d, yyyy');
  
  // Parse the digest content (markdown-like format)
  const contentSections = digest.content.split('\n\n').filter(section => section.trim());
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
              <Newspaper className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-purple-400 uppercase tracking-wider">
                Daily Digest
              </h1>
              <p className="text-gray-400">AI-powered news summary</p>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {digest.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-8">
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
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold">
                AI Summary
              </span>
            </div>
          </div>
          
          {/* Featured Image */}
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
            <Image
              src={getArticleImage(digest)}
              alt={getImageAltText(digest)}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="text-sm text-gray-300">Daily Digest • {formattedDate}</p>
            </div>
          </div>
          
          {/* Excerpt */}
          <div className="bg-gray-800/50 rounded-xl p-6 mb-8 border border-gray-700">
            <div className="flex items-start space-x-3">
              <Zap className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Today&apos;s AI Summary</h3>
                <p className="text-gray-300">{digest.excerpt}</p>
              </div>
            </div>
          </div>
        </header>
        
        {/* Digest Content */}
        <article className="prose prose-lg prose-invert max-w-none">
          {contentSections.map((section, index) => {
            // Check for section headers
            if (section.includes('**DAILY DIGEST:**')) {
              return (
                <div key={index} className="mb-8">
                  <div className="text-3xl font-bold mb-4 text-center">
                    {section.replace('**DAILY DIGEST:**', '').trim()}
                  </div>
                </div>
              );
            }
            
            if (section.includes('🔥 **TOP STORY:**')) {
              return (
                <div key={index} className="mb-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 rounded-lg bg-red-500/20">
                      <TrendingUpIcon className="w-6 h-6 text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold">Top Story</h2>
                  </div>
                  <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
                    <p className="text-lg">{section.replace('🔥 **TOP STORY:**', '').trim()}</p>
                  </div>
                </div>
              );
            }
            
            if (section.includes('📈 **MARKET MOVERS:**')) {
              return (
                <div key={index} className="mb-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 rounded-lg bg-green-500/20">
                      <TrendingUpIcon className="w-6 h-6 text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold">Market Movers</h2>
                  </div>
                  <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
                    <p className="text-lg">{section.replace('📈 **MARKET MOVERS:**', '').trim()}</p>
                  </div>
                </div>
              );
            }
            
            if (section.includes('💡 **TECH SPOTLIGHT:**')) {
              return (
                <div key={index} className="mb-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <Lightbulb className="w-6 h-6 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold">Tech Spotlight</h2>
                  </div>
                  <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
                    <p className="text-lg">{section.replace('💡 **TECH SPOTLIGHT:**', '').trim()}</p>
                  </div>
                </div>
              );
            }
            
            if (section.includes('🌍 **GLOBAL WATCH:**')) {
              return (
                <div key={index} className="mb-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 rounded-lg bg-cyan-500/20">
                      <Globe className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h2 className="text-2xl font-bold">Global Watch</h2>
                  </div>
                  <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
                    <p className="text-lg">{section.replace('🌍 **GLOBAL WATCH:**', '').trim()}</p>
                  </div>
                </div>
              );
            }
            
            if (section.includes('🔮 **TOMORROW&apos;S OUTLOOK:**')) {
              return (
                <div key={index} className="mb-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <Zap className="w-6 h-6 text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold">Tomorrow&apos;s Outlook</h2>
                  </div>
                  <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
                    <p className="text-lg">{section.replace('🔮 **TOMORROW&apos;S OUTLOOK:**', '').trim()}</p>
                  </div>
                </div>
              );
            }
            
            if (section.includes('📖 **READ THE FULL ARTICLES:**')) {
              return (
                <div key={index} className="mb-8">
                  <h2 className="text-2xl font-bold mb-6">Read the Full Articles</h2>
                  <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
                    <ul className="space-y-3">
                      {section
                        .replace('📖 **READ THE FULL ARTICLES:**', '')
                        .split('\n')
                        .filter(line => line.trim())
                        .map((line, lineIndex) => (
                          <li key={lineIndex} className="flex items-start space-x-3">
                            <span className="text-purple-400 font-semibold">{lineIndex + 1}.</span>
                            <span className="text-gray-300">{line.trim()}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              );
            }
            
            // Regular paragraphs
            return (
              <div key={index} className="mb-6">
                <p className="text-gray-300 leading-relaxed">{section}</p>
              </div>
            );
          })}
        </article>
        
        {/* Tags */}
        {digest.tags && digest.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-800">
            <h3 className="text-lg font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {digest.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-full bg-gray-800 text-gray-300 text-sm hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Share Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <h3 className="text-lg font-semibold mb-4">Share This Digest</h3>
          <div className="flex space-x-4">
            <button className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-center">
              Share on Twitter
            </button>
            <button className="flex-1 py-3 rounded-lg bg-blue-800 hover:bg-blue-900 transition-colors text-center">
              Share on LinkedIn
            </button>
            <button className="flex-1 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-center">
              Copy Link
            </button>
          </div>
        </div>
        
        {/* Newsletter CTA */}
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-700/30">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Get Daily Digests in Your Inbox</h3>
            <p className="text-gray-300 mb-6">
              Never miss a daily summary. Subscribe to get the top stories delivered daily.
            </p>
            <form className="max-w-md mx-auto flex gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link href="/" className="text-2xl font-bold">
                Trend Pulse
              </Link>
              <p className="text-gray-400 mt-2">AI-powered real-time news & trends</p>
            </div>
            <div className="flex space-x-6">
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Trend Pulse. All rights reserved.</p>
            <p className="mt-2">Daily digests generated by AI. Human oversight ensures quality and accuracy.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}