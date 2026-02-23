import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import MarkdownRenderer from './MarkdownRenderer';

interface PageTemplateProps {
  title: string;
  content: string;
  showStats?: boolean;
  ctaText?: string;
  ctaLink?: string;
}

export default function PageTemplate({ 
  title, 
  content, 
  showStats = false,
  ctaText = 'Back to Home',
  ctaLink = '/'
}: PageTemplateProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <h1 className="font-space text-4xl sm:text-5xl font-bold text-white mb-6">
              {title}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
          </div>

          {/* Page Content */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
            <MarkdownRenderer content={content} />
          </div>

          {/* Optional Stats Section */}
          {showStats && (
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-gray-800/30 border border-gray-700 rounded-xl">
                <div className="text-3xl font-bold text-blue-400 mb-2">24/7</div>
                <div className="text-gray-300">News Coverage</div>
              </div>
              <div className="text-center p-6 bg-gray-800/30 border border-gray-700 rounded-xl">
                <div className="text-3xl font-bold text-green-400 mb-2">100+</div>
                <div className="text-gray-300">Daily Articles</div>
              </div>
              <div className="text-center p-6 bg-gray-800/30 border border-gray-700 rounded-xl">
                <div className="text-3xl font-bold text-purple-400 mb-2">&lt;5min</div>
                <div className="text-gray-300">To Publish</div>
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-800/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Stay Informed</h3>
              <p className="text-gray-300 mb-6">
                Subscribe to our daily newsletter for the latest news and analysis
              </p>
              <a
                href={ctaLink}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all"
              >
                {ctaText}
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}