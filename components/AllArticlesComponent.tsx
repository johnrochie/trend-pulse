'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Eye, Tag, ChevronRight, Filter, Search, Grid, List } from 'lucide-react';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  views: number;
  tags: string[];
  publishedAt: string;
  url: string;
  imageUrl: string;
  color: string;
  slug: string;
}

export default function AllArticlesComponent() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Categories from our articles
  const categories = [
    'All',
    'Technology',
    'Business', 
    'Entertainment',
    'Lifestyle',
    'Finance',
    'Health',
    'Science',
    'Sports'
  ];

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/articles?limit=100'); // Get up to 100 articles
        const data = await response.json();
        
        if (data.success) {
          setArticles(data.data);
        } else {
          setError('Failed to load articles');
        }
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError('Failed to load articles. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Filter articles based on search and category
  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format view count
  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Loading articles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-900/30 border border-red-700 rounded-xl p-8 max-w-md mx-auto">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search articles by title, content, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'}`}
            >
              <Grid className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'}`}
            >
              <List className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-gray-400">
                Showing <span className="text-white font-semibold">{filteredArticles.length}</span> of{' '}
                <span className="text-white font-semibold">{articles.length}</span> articles
                {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-400">Latest First</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Grid/List */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-8 max-w-md mx-auto">
            <p className="text-gray-400 mb-4">No articles found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <Link
              key={article.id}
              href={article.url}
              className="group bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden hover:border-blue-500/50 hover:bg-gray-800/50 transition-all"
            >
              {/* Category Badge */}
              <div className="px-4 pt-4">
                <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(article.category)}`}>
                  {article.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {article.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {article.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {article.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-800 text-gray-500 text-xs rounded">
                      +{article.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{formatViews(article.views)}</span>
                  </div>
                </div>
              </div>

              {/* Read More */}
              <div className="px-4 pb-4">
                <div className="flex items-center justify-between text-blue-400 group-hover:text-blue-300">
                  <span className="text-sm font-medium">Read Article</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        // List View
        <div className="space-y-4">
          {filteredArticles.map((article) => (
            <Link
              key={article.id}
              href={article.url}
              className="group block bg-gray-800/30 border border-gray-700 rounded-xl p-6 hover:border-blue-500/50 hover:bg-gray-800/50 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                {/* Left Column - Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(article.category)}`}>
                      {article.category}
                    </span>
                    <span className="text-sm text-gray-500">{formatDate(article.publishedAt)}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-400 mb-4">
                    {article.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-1 px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{article.readTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{formatViews(article.views)} views</span>
                    </div>
                  </div>
                </div>

                {/* Right Column - Read More */}
                <div className="md:w-48 flex flex-col justify-between">
                  <div className="text-right">
                    <div className="inline-flex items-center gap-2 text-blue-400 group-hover:text-blue-300">
                      <span className="font-medium">Read Full Article</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Footer Note */}
      {filteredArticles.length > 0 && (
        <div className="text-center pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
            Showing {filteredArticles.length} of {articles.length} articles • 
            Articles update automatically every 6 hours • 
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
}

// Helper function for category colors
function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Technology: 'bg-blue-500/20 text-blue-400',
    Business: 'bg-purple-500/20 text-purple-400',
    Entertainment: 'bg-pink-500/20 text-pink-400',
    Lifestyle: 'bg-green-500/20 text-green-400',
    Finance: 'bg-yellow-500/20 text-yellow-400',
    Health: 'bg-red-500/20 text-red-400',
    Science: 'bg-cyan-500/20 text-cyan-400',
    Sports: 'bg-orange-500/20 text-orange-400',
  };
  
  return colors[category] || 'bg-gray-500/20 text-gray-400';
}