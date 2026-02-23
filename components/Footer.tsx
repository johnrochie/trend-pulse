'use client';

import Link from 'next/link';
import { Twitter, Linkedin, Github, Mail, TrendingUp, DollarSign, Zap } from 'lucide-react';

const footerLinks = {
  newsCategories: [
    { name: 'Tech News', href: '/category/tech' },
    { name: 'Business', href: '/category/business' },
    { name: 'Finance', href: '/category/finance' },
    { name: 'Lifestyle', href: '/category/lifestyle' },
    { name: 'Entertainment', href: '/category/entertainment' },
  ],
  Resources: [
    { name: 'Trending Now', href: '/trending' },
    { name: 'Market Analysis', href: '/analysis' },
    { name: 'Daily Briefings', href: '/briefings' },
    { name: 'Data Sources', href: '/sources' },
    { name: 'API Access', href: '/api' },
  ],
  Company: [
    { name: 'About', href: '/about' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Contact', href: '/contact' },
  ],
};

const socialLinks = [
  { icon: Twitter, href: 'https://twitter.com/trendpulse', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com/company/trendpulse', label: 'LinkedIn' },
  { icon: Github, href: 'https://github.com/trendpulse', label: 'GitHub' },
  { icon: Mail, href: 'mailto:hello@trendpulse.ai', label: 'Email' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600" />
                <div>
                  <h2 className="font-space text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    Trend Pulse
                  </h2>
                  <p className="text-sm text-gray-400">Turn trends into profits</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6">
                AI-powered trend intelligence for tech, marketing, and business growth.
                Daily insights to help you monetize trends faster.
              </p>
            </div>

            {/* Newsletter */}
            <div className="mb-8">
              <h3 className="font-bold text-white mb-4">Get Daily Trend Alerts</h3>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg font-semibold transition-all"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-2">
                15,000+ subscribers. No spam, unsubscribe anytime.
              </p>
            </div>

            {/* Social links */}
            <div>
              <h3 className="font-bold text-white mb-4">Follow the Trends</h3>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 hover:border-blue-500/30 transition-all group"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                {category === 'newsCategories' && <TrendingUp className="w-4 h-4" />}
                {category === 'monetization' && <DollarSign className="w-4 h-4" />}
                {category === 'resources' && <Zap className="w-4 h-4" />}
                {category === 'newsCategories' ? 'News Categories' : 
                 category === 'monetization' ? 'Monetization' : 
                 category === 'resources' ? 'Resources' : category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-12 pt-12 border-t border-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '15K+', label: 'Daily Readers', color: 'from-blue-500 to-cyan-500' },
              { value: '50K+', label: 'Daily Articles', color: 'from-green-500 to-emerald-500' },
              { value: '2.5M+', label: 'Monthly Pageviews', color: 'from-purple-500 to-pink-500' },
              { value: '97%', label: 'Trend Accuracy', color: 'from-orange-500 to-red-500' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${stat.color} mb-2`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-gray-950 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-400">
                © {new Date().getFullYear()} Trend Pulse. All rights reserved.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                AI-powered real-time news and trend analysis platform. Stay ahead of what's trending.
              </p>
            </div>

            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-gray-400 hover:text-white">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-sm text-gray-400 hover:text-white">
                Cookie Policy
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-gray-400">Live Updates</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 p-3 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform z-40"
        aria-label="Back to top"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  );
}