'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Loader2, FileText } from 'lucide-react';
import { getArticleImage, getImageAltText } from '@/lib/images';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  slug: string;
  publishedAt: string;
  imageUrl: string;
}

export default function SearchClient() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/articles?limit=100`);
      const data = await res.json();
      if (!data.success || !data.data?.length) {
        setResults([]);
        return;
      }
      const ql = q.toLowerCase().trim();
      const matched = data.data.filter(
        (a: Article & { tags?: string[] }) =>
          a.title?.toLowerCase().includes(ql) ||
          a.excerpt?.toLowerCase().includes(ql) ||
          a.category?.toLowerCase().includes(ql) ||
          (Array.isArray(a.tags) && a.tags.some((t: string) => t.toLowerCase().includes(ql)))
      );
      setResults(matched.slice(0, 24));
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const q = params.get('q') || '';
    if (q) {
      setQuery(q);
      search(q);
    }
  }, [search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = new URL(window.location.pathname, window.location.origin);
    url.searchParams.set('q', query);
    window.history.replaceState({}, '', url.toString());
    search(query);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Search Articles</h1>

        <form onSubmit={handleSubmit} className="relative mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, topic, or keyword..."
            className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
          >
            Search
          </button>
        </form>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        )}

        {!loading && searched && (
          <>
            <p className="text-gray-400 mb-6">
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </p>
            {results.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No articles match your search.</p>
                <p className="text-sm mt-2">Try different keywords or browse all articles.</p>
                <Link href="/articles" className="mt-4 inline-block text-blue-400 hover:underline">
                  Browse all articles →
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {results.map((article) => (
                  <Link
                    key={article.id}
                    href={`/article/${article.slug}`}
                    className="block bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-blue-500/50 transition-colors"
                  >
                    <div className="flex gap-6">
                      <div className="relative w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-800">
                        <Image
                          src={getArticleImage(article)}
                          alt={getImageAltText(article)}
                          width={128}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-medium text-blue-400">{article.category}</span>
                        <h2 className="text-lg font-semibold text-white mt-1 line-clamp-2">
                          {article.title}
                        </h2>
                        <p className="text-gray-400 text-sm mt-2 line-clamp-2">{article.excerpt}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {!loading && !searched && (
          <p className="text-gray-500">Enter a search term above to find articles.</p>
        )}
      </div>
    </div>
  );
}
