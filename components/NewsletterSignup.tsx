'use client';

import { motion } from 'framer-motion';
import { Mail, Bell, TrendingUp, Zap, Check } from 'lucide-react';
import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, connect to your email service (ConvertKit, Mailchimp, etc.)
    console.log('Newsletter signup:', email);
    setSubscribed(true);
    setEmail('');
    
    // Reset after 5 seconds
    setTimeout(() => {
      setSubscribed(false);
    }, 5000);
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
            {subscribed ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">You're Subscribed!</h3>
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
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
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

                  <button
                    type="submit"
                    className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    Subscribe to Daily Briefing
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
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
            <div className="inline-flex items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>50,000+ subscribers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span>97% open rate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                <span>Daily delivery at 7 AM</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}