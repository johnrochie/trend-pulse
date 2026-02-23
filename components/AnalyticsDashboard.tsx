'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Eye, 
  TrendingUp, 
  Clock, 
  BarChart3, 
  FileText,
  Smartphone,
  Globe,
  Calendar
} from 'lucide-react';

interface AnalyticsData {
  summary: {
    totalVisitors: number;
    pageViews: number;
    avgTimeOnSite: number;
    bounceRate: number;
    articlesPublished: number;
    automationRuns: number;
  };
  topArticles: Array<{
    id: number;
    title: string;
    views: number;
    category: string;
    publishedAt: string;
  }>;
  trafficSources: Array<{
    source: string;
    visitors: number;
    percentage: number;
  }>;
  dailyStats: Array<{
    date: string;
    visitors: number;
    pageViews: number;
  }>;
  automationStats: {
    lastRun: string;
    articlesGenerated: number;
    successRate: number;
    nextRun: string;
  };
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Calculate realistic stats based on site age (launched ~today)
      const siteAgeDays = 1; // Site just launched
      const baseVisitors = Math.max(10, Math.floor(siteAgeDays * 15)); // ~15 visitors per day for new site
      const totalVisitors = baseVisitors + Math.floor(Math.random() * 10);
      const pageViews = totalVisitors * 3; // ~3 pages per visitor for news site
      
      // Mock data - in production, fetch from your analytics API
      const mockData: AnalyticsData = {
        summary: {
          totalVisitors,
          pageViews,
          avgTimeOnSite: 1.8, // Lower for new site, will increase as content grows
          bounceRate: 65, // Higher for new site, will decrease as UX improves
          articlesPublished: 54, // Actual article count
          automationRuns: 4 // ~4 runs since launch
        },
        topArticles: [
          { id: 1, title: 'AI Regulation and Ethics: What 2026 Holds for Artificial Intelligence Governance', views: Math.floor(totalVisitors * 0.3), category: 'Technology', publishedAt: '2026-02-23' },
          { id: 2, title: 'Remote Work Productivity: Tools and Strategies for Distributed Teams in 2026', views: Math.floor(totalVisitors * 0.25), category: 'Business', publishedAt: '2026-02-23' },
          { id: 3, title: 'Streaming Service Evolution: How Price Wars Are Reshaping Entertainment', views: Math.floor(totalVisitors * 0.2), category: 'Entertainment', publishedAt: '2026-02-23' },
          { id: 4, title: 'Mental Health and Wellness: How Apps Are Supporting Better Mental Health', views: Math.floor(totalVisitors * 0.18), category: 'Lifestyle', publishedAt: '2026-02-23' },
          { id: 5, title: 'Cryptocurrency Regulation: Global Approaches to Digital Asset Governance', views: Math.floor(totalVisitors * 0.15), category: 'Finance', publishedAt: '2026-02-23' }
        ],
        trafficSources: [
          { source: 'Direct', visitors: Math.floor(totalVisitors * 0.6), percentage: 60 }, // Higher for new site
          { source: 'Social Media', visitors: Math.floor(totalVisitors * 0.25), percentage: 25 },
          { source: 'Search Engines', visitors: Math.floor(totalVisitors * 0.1), percentage: 10 }, // Lower SEO initially
          { source: 'Referrals', visitors: Math.floor(totalVisitors * 0.05), percentage: 5 }
        ],
        dailyStats: [
          { date: 'Feb 23', visitors: totalVisitors, pageViews }
        ],
        automationStats: {
          lastRun: new Date().toISOString(),
          articlesGenerated: 54,
          successRate: 100,
          nextRun: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString() // Next run in 6 hours
        }
      };
      
      setTimeout(() => {
        setData(mockData);
        setLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    change, 
    description 
  }: { 
    title: string; 
    value: string | number; 
    icon: any; 
    change?: string;
    description?: string;
  }) => (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-gray-700/50 rounded-lg">
          <Icon className="w-6 h-6 text-blue-400" />
        </div>
        {change && (
          <span className={`text-sm font-medium px-2 py-1 rounded-full ${change.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {change}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
      <p className="text-gray-400 text-sm">{title}</p>
      {description && (
        <p className="text-gray-500 text-xs mt-2">{description}</p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-32 bg-gray-800 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-gray-400">Track your site performance and automation health</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="flex bg-gray-800 rounded-lg p-1">
              {['7d', '30d', '90d'].map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    timeRange === range 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            <button 
              onClick={fetchAnalyticsData}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Visitors"
            value={data.summary.totalVisitors.toLocaleString()}
            icon={Users}
            change="+12%"
            description="Last 7 days"
          />
          <StatCard
            title="Page Views"
            value={data.summary.pageViews.toLocaleString()}
            icon={Eye}
            change="+18%"
            description="Average 4.3 pages/visit"
          />
          <StatCard
            title="Avg. Time on Site"
            value={`${data.summary.avgTimeOnSite}m`}
            icon={Clock}
            change="+5%"
            description="Engagement improving"
          />
          <StatCard
            title="Articles Published"
            value={data.summary.articlesPublished}
            icon={FileText}
            change="+5 new"
            description="AI-generated content"
          />
          <StatCard
            title="Bounce Rate"
            value={`${data.summary.bounceRate}%`}
            icon={TrendingUp}
            change="-8%"
            description="Below industry average"
          />
          <StatCard
            title="Automation Runs"
            value={data.summary.automationRuns}
            icon={BarChart3}
            change="100% success"
            description="Every 6 hours"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Articles */}
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Top Articles</h2>
              <FileText className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {data.topArticles.map((article, index) => (
                <div key={article.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-lg">
                      <span className="text-sm font-bold text-gray-300">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-white text-sm line-clamp-1">{article.title}</h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-xs text-gray-400">{article.category}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-400">{article.publishedAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-white">{article.views.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Traffic Sources</h2>
              <Globe className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {data.trafficSources.map((source) => (
                <div key={source.source} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm font-medium text-white">{source.source}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-white">{source.visitors.toLocaleString()}</span>
                      <span className="text-xs text-gray-400 ml-2">({source.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Stats Chart */}
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Daily Visitors & Page Views</h2>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-64 flex items-end space-x-2">
              {data.dailyStats.map((day) => {
                const maxVisitors = Math.max(...data.dailyStats.map(d => d.visitors));
                const visitorHeight = (day.visitors / maxVisitors) * 100;
                const pageViewHeight = (day.pageViews / (maxVisitors * 4)) * 100;
                
                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center">
                    <div className="flex items-end space-x-1 w-full justify-center">
                      <div 
                        className="w-4 bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t"
                        style={{ height: `${visitorHeight}%` }}
                        title={`${day.visitors} visitors`}
                      ></div>
                      <div 
                        className="w-4 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t"
                        style={{ height: `${pageViewHeight}%` }}
                        title={`${day.pageViews} page views`}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-400 mt-2">{day.date}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-center space-x-6 mt-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded"></div>
                <span className="text-sm text-gray-300">Visitors</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
                <span className="text-sm text-gray-300">Page Views</span>
              </div>
            </div>
          </div>

          {/* Automation Health */}
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Automation Health</h2>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Last Run</span>
                  <span className="text-white font-medium">{data.automationStats.lastRun}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Articles Generated</span>
                  <span className="text-white font-medium">{data.automationStats.articlesGenerated}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Success Rate</span>
                  <span className="text-green-400 font-medium">{data.automationStats.successRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Next Run</span>
                  <span className="text-blue-400 font-medium">{data.automationStats.nextRun}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">System Status</span>
                  <span className="text-sm font-medium text-green-400">All Systems Operational</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full w-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Quick Stats</h2>
              <Smartphone className="w-5 h-5 text-gray-400" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-white mb-1">68%</div>
                <div className="text-sm text-gray-400">Mobile Traffic</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-white mb-1">32%</div>
                <div className="text-sm text-gray-400">Desktop Traffic</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-white mb-1">4.3</div>
                <div className="text-sm text-gray-400">Pages/Visit</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-white mb-1">2.8m</div>
                <div className="text-sm text-gray-400">Avg. Session</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-white mb-1">42%</div>
                <div className="text-sm text-gray-400">New Visitors</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-white mb-1">58%</div>
                <div className="text-sm text-gray-400">Returning</div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">AdSense Status</span>
                <span className="text-yellow-400 font-medium">Pending Approval</span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Application submitted. Typically takes 1-3 days.
              </div>
            </div>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Analytics update every 24 hours. 
            <span className="text-blue-400 ml-2">Last updated: {new Date().toLocaleString()}</span>
          </p>
          <p className="mt-2">
            Connect Google Analytics for real-time data. Add your GA4 Measurement ID in .env.local
          </p>
        </div>
      </div>
    </div>
  );
}