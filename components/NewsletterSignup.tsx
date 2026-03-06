'use client';

import { motion } from 'framer-motion';
import { Mail, Bell, TrendingUp, Zap, Check } from 'lucide-react';
import { useState } from 'react';
import { subscribeNewsletter } from '@/app/actions/subscribe-newsletter';

export default function NewsletterSignup() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const honeypot = formData.get('website_url') as string;
    setStatus('sending');
    setErrorMessage('');
    const result = await subscribeNewsletter(email, honeypot);
    if (result.ok) {
      setStatus('success');
      e.currentTarget.reset();
    } else {
      setStatus('error');
      setErrorMessage(result.error ?? 'Something went wrong. Please try again.');
    }
  };

  return (
    <section className="py-12 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 mb-8"
          >
            <Bell className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">BREAKING NEWS ALERTS</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-space text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
          >
            Stay Ahead of the News
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-12"
          >
            Get daily breaking news alerts, trend analysis, and market insights delivered to your inbox.
          </motion.p>
        </div>

        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 backdrop-blur-sm"
          >
            {status === 'success' ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">You&apos;re subscribed!</h3>
                <p className="text-gray-300">
                  Welcome to Trend Pulse. Check your inbox for confirmation and your first news briefing.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Daily News Briefing</h3>
                    <p className="text-gray-400">Free newsletter with top stories and analysis</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="newsletter-website_url">Leave blank</label>
                    <input type="text" id="newsletter-website_url" name="website_url" tabIndex={-1} autoComplete="off" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Your inbox
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="your@example.com"
                        className="w-full pl-12 pr-4 py-4 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-900/50 rounded-xl border border-gray-700">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-sm font-medium text-white">Trend Analysis</p>
                        <p className="text-xs text-gray-400">Daily market insights</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-900/50 rounded-xl border border-gray-700">
                      <Zap className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-sm font-medium text-white">Breaking News</p>
                        <p className="text-xs text-gray-400">Real-time alerts</p>
                      </div>
                    </div>
                  </div>

                  {status === 'error' && (
                    <p className="text-red-400 text-sm">{errorMessage}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'sending' ? 'Subscribing…' : 'Subscribe to Daily Briefing'}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    By subscribing, you agree to our <a href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</a>. Unsubscribe anytime.
                  </p>
                </form>
              </>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>Join our readers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span>Daily delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                <span>Unsubscribe anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
