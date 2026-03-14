import { Metadata } from 'next';
import AllArticlesComponent from '@/components/AllArticlesComponent';
import { fetchArticles } from '@/lib/articles-api';

export const metadata: Metadata = {
  title: 'All Articles | Complete News Archive - Trend Pulse',
  description: 'Browse our complete archive of news articles across all categories: Technology, Business, Entertainment, Lifestyle, Finance, Health, Science, and Sports.',
};

export const revalidate = 3600;

export default async function AllArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const response = await fetchArticles({ limit: 500 });
  const allItems = response.success && response.data ? response.data : [];
  // Exclude daily digests – they have their own archive at /daily-digest
  const initialArticles = allItems.filter(
    (a: { type?: string; slug?: string }) =>
      a.type !== 'daily-digest' && !a.slug?.startsWith('daily-digest-')
  );
  const categoryCount = new Set(
    initialArticles.map((a: { category?: string }) => (a.category || '').trim()).filter(Boolean)
  ).size;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">All Articles</h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Browse our complete archive of {initialArticles.length}+ news articles across all categories. 
            Stay informed with our latest analysis and insights.
          </p>
          <div className="flex items-center justify-center space-x-4 mt-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">Live Updates</span>
            </div>
            <span className="text-gray-500">•</span>
            <span className="text-sm text-gray-400">{initialArticles.length}+ Articles</span>
            <span className="text-gray-500">•</span>
            <span className="text-sm text-gray-400">{categoryCount} Categories</span>
          </div>
        </div>

        {/* Main Content */}
        <AllArticlesComponent
          initialArticles={initialArticles}
          initialCategory={category}
        />
      </div>
    </div>
  );
}