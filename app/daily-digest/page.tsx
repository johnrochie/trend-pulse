import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Eye, TrendingUp, Newspaper, ArrowRight, Search, Filter, CalendarDays, BookOpen, Zap } from 'lucide-react';
import { format, parseISO, subDays } from 'date-fns';
import { getArticles } from '@/lib/api';
import { getArticleImage, getImageAltText } from '@/lib/images';
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

async function getDailyDigests(): Promise<DailyDigest[]> {
  try {
    // Fetch all daily digests
    const data = await getArticles({ type: 'daily-digest', limit: 30 });
    
    if (data.success && data.data && data.data.length > 0) {
      // Filter to only daily-digest type and sort by date (newest first)
      const digests = data.data
        .filter((article: any) => article.type === 'daily-digest')
        .sort((a: any, b: any) => 
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
      
      return digests;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching daily digests:', error);
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Daily Digest Archive - AI-Powered News Summaries | Trend Pulse',
    description: 'Browse all daily AI-powered news digests. Get summaries of top stories across technology, business, finance, entertainment, and more.',
    keywords: 'daily digest, news summary, AI analysis, trending news, market updates, technology news, business news',
    openGraph: {
      title: 'Daily Digest Archive - AI-Powered News Summaries',
      description: 'Browse all daily AI-powered news digests on Trend Pulse',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Daily Digest Archive - AI-Powered News Summaries',
      description: 'Browse all daily AI-powered news digests on Trend Pulse',
    },
  };
}

export default async function DailyDigestArchivePage() {
  const digests = await getDailyDigests();
  const latestDigest = digests[0];
  
  // Group digests by month for archive navigation
  const digestsByMonth: Record<string, DailyDigest[]> = {};
  digests.forEach(digest => {
    const date = parseISO(digest.publishedAt);
    const monthYear = format(date, 'MMMM yyyy');
    
    if (!digestsByMonth[monthYear]) {
      digestsByMonth[monthYear] = [];
    }
    digestsByMonth[monthYear].push(digest);
  });
  
  // Get unique tags from all digests
  const allTags = Array.from(new Set(digests.flatMap(d => d.tags || []))).slice(0, 10);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-b border-purple-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 mb-6">
              <Newspaper className="w-6 h-6 text-purple-400" />
              <span className="text-lg font-semibold text-purple-300">DAILY DIGEST ARCHIVE</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              AI-Powered News Summaries
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Browse all daily digests curated by our AI. Get the top stories summarized with context, analysis, and insights.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700">
                <CalendarDays className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">Updated Daily</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300">AI Analysis</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700">
                <BookOpen className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">{digests.length} Digests</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters & Navigation */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search Digests
              </h3>
              <input
                type="text"
                placeholder="Search by keyword..."
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Tags Filter */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Popular Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag, index) => (
                  <button
                    key={index}
                    className="px-3 py-1.5 rounded-full bg-gray-900/50 text-gray-300 text-sm hover:bg-gray-800 hover:text-white transition-colors border border-gray-700"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Archive by Month */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Archive by Month</h3>
              <div className="space-y-2">
                {Object.keys(digestsByMonth).map((monthYear) => (
                  <button
                    key={monthYear}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-800/50 transition-colors text-gray-300 hover:text-white"
                  >
                    <div className="flex justify-between items-center">
                      <span>{monthYear}</span>
                      <span className="text-sm text-gray-500">
                        {digestsByMonth[monthYear].length} digests
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Latest Digest Preview */}
            {latestDigest && (
              <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-700/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Latest Digest</h3>
                <div className="space-y-3">
                  <div className="text-sm text-purple-300">
                    {format(parseISO(latestDigest.publishedAt), 'EEEE, MMMM d, yyyy')}
                  </div>
                  <h4 className="font-semibold line-clamp-2">{latestDigest.title}</h4>
                  <p className="text-sm text-gray-400 line-clamp-2">{latestDigest.excerpt}</p>
                  <Link
                    href={`/daily-digest/${latestDigest.slug.replace('daily-digest-', '')}`}
                    className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Read Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Main Content - Digest Grid */}
          <div className="lg:col-span-3">
            {/* Stats Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-6 bg-gray-800/30 rounded-2xl border border-gray-700">
              <div>
                <h2 className="text-2xl font-bold">All Daily Digests</h2>
                <p className="text-gray-400">
                  Browse {digests.length} AI-powered news summaries
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{digests.length}</div>
                  <div className="text-sm text-gray-400">Total Digests</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {digests.filter(d => d.breaking).length}
                  </div>
                  <div className="text-sm text-gray-400">Breaking News</div>
                </div>
              </div>
            </div>

            {/* Digest Grid */}
            {digests.length === 0 ? (
              <div className="text-center py-16">
                <Newspaper className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Digests Available</h3>
                <p className="text-gray-400">
                  Daily digests will appear here once they are generated by our AI.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {digests.map((digest) => {
                  const dateSlug = digest.slug.replace('daily-digest-', '');
                  const publishedDate = parseISO(digest.publishedAt);
                  const formattedDate = format(publishedDate, 'MMM d, yyyy');
                  const isRecent = new Date().getTime() - publishedDate.getTime() < 7 * 24 * 60 * 60 * 1000;
                  
                  return (
                    <Link
                      key={digest.id}
                      href={`/daily-digest/${dateSlug}`}
                      className="group bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300"
                    >
                      {/* Image */}
                      <div className="relative h-48">
                        <Image
                          src={getArticleImage(digest)}
                          alt={getImageAltText(digest)}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        
                        {/* Date Badge */}
                        <div className="absolute top-4 left-4">
                          <div className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-sm text-white text-sm font-medium">
                            {formattedDate}
                          </div>
                        </div>
                        
                        {/* Breaking Badge */}
                        {digest.breaking && (
                          <div className="absolute top-4 right-4">
                            <span className="px-3 py-1.5 rounded-full bg-red-600/90 text-white text-sm font-semibold flex items-center gap-1.5">
                              <Zap className="w-3.5 h-3.5" />
                              BREAKING
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${isRecent ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`} />
                            <span className="text-sm text-gray-400">
                              {format(publishedDate, 'EEEE')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Eye className="w-4 h-4" />
                            <span>{digest.views.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-purple-300 transition-colors">
                          {digest.title}
                        </h3>
                        
                        <p className="text-gray-400 mb-4 line-clamp-2">
                          {digest.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                              <TrendingUp className="w-4 h-4 text-yellow-400" />
                              <span className="text-sm text-gray-300">{digest.trendingScore}</span>
                            </div>
                            <div className="text-sm text-gray-500">{digest.readTime} read</div>
                          </div>
                          
                          <div className="flex items-center gap-2 text-purple-400 group-hover:text-purple-300 transition-colors">
                            <span className="text-sm font-medium">Read Digest</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                        
                        {/* Tags */}
                        {digest.tags && digest.tags.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-700">
                            <div className="flex flex-wrap gap-1.5">
                              {digest.tags.slice(0, 3).map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 rounded-full bg-gray-900/50 text-gray-400 text-xs border border-gray-700"
                                >
                                  #{tag}
                                </span>
                              ))}
                              {digest.tags.length > 3 && (
                                <span className="px-2 py-1 rounded-full bg-gray-900/50 text-gray-500 text-xs border border-gray-700">
                                  +{digest.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Newsletter CTA */}
            <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-700/30">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Never Miss a Digest</h3>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  Subscribe to get daily AI-powered news summaries delivered to your inbox. 
                  Stay informed with the top stories across technology, business, finance, and more.
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
                <p className="text-gray-500 text-sm mt-4">
                  Unsubscribe anytime. We respect your privacy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <div className="border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Navigate</h3>
              <div className="flex flex-wrap gap-4">
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
                <Link href="/daily-digest" className="text-gray-400 hover:text-white transition-colors">
                  Daily Digest Archive
                </Link>
                <Link href="/analytics" className="text-gray-400 hover:text-white transition-colors">
                  Analytics
                </Link>
              </div>
            </div>
            <div className="text-gray-500 text-sm">
              <p>Trend Pulse Daily Digest Archive</p>
              <p className="mt-1">© {new Date().getFullYear()} Trend Pulse. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
