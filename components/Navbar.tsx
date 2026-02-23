'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search, TrendingUp, DollarSign, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { label: 'Tech News', href: '/category/tech', icon: Zap, color: 'from-blue-500 to-cyan-500' },
  { label: 'Business', href: '/category/business', icon: DollarSign, color: 'from-green-500 to-emerald-500' },
  { label: 'Finance', href: '/category/finance', icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
  { label: 'Lifestyle', href: '/category/lifestyle', icon: Users, color: 'from-orange-500 to-red-500' },
  { label: 'Entertainment', href: '/category/entertainment', icon: TrendingUp, color: 'from-pink-500 to-rose-500' },
];

const trendingNow = [
  'AI Regulation',
  'Bitcoin ETF',
  'Streaming Wars',
  'Climate Tech',
  'Fitness Trends',
];

const premiumFeatures = [
  'Advanced Trend Analytics',
  'Real-time Market Alerts',
  'Premium Research Reports',
  'Exclusive Data Feeds',
  'Priority Support',
  'Custom Dashboard',
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 group-hover:from-purple-600 group-hover:to-blue-600 transition-all" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="font-space text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    Trend Pulse
                  </h1>
                  <p className="text-xs text-gray-400">AI-Powered Real-Time News & Trends</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  <div className={`p-1.5 rounded-lg bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">{item.label}</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
                </Link>
              ))}

              {/* Premium CTA */}
              <div className="relative group">
                <Link
                  href="/premium"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white font-semibold text-sm transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
                >
                  Premium Access
                </Link>
                
                {/* Premium dropdown */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-2xl">
                    <h3 className="font-bold text-white mb-2">Premium Features:</h3>
                    <ul className="space-y-2">
                      {premiumFeatures.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <div className="text-2xl font-bold text-white">€97<span className="text-sm text-gray-400">/month</span></div>
                      <p className="text-xs text-gray-400">Cancel anytime</p>
                    </div>
                  </div>
                </div>
              </div>
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-800 bg-gray-900"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color}`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium text-white">{item.label}</span>
                </Link>
              ))}
              
              <div className="pt-4 border-t border-gray-800">
                <Link
                  href="/premium"
                  className="block w-full text-center px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Premium Access - €97/month
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </header>

      {/* Search modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20">
          <div className="w-full max-w-2xl px-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search trends, articles, tools..."
                className="w-full px-6 py-4 bg-gray-800 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-lg"
                autoFocus
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="mt-4 p-4 bg-gray-800 rounded-2xl">
              <p className="text-gray-400 text-sm">Try: "AI marketing trends 2026" or "SaaS growth strategies"</p>
            </div>
          </div>
        </div>
      )}

      {/* Affiliate announcement bar */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-b border-blue-800/30">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-white">Trend Alert:</span> AI Regulation & Content Tools Trending
              </p>
            </div>
            <Link
              href="/article/gavin-newsom-bans-kid-rock-from-entering-californi"
              className="text-sm text-blue-400 hover:text-blue-300 font-medium"
            >
              Read Analysis →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}