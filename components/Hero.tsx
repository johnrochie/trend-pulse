'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Zap, Clock } from 'lucide-react';

export default function Hero() {
  return (
    <section className="py-12 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Simple, clean header like Joe.ie */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-space text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6"
          >
            Trend Pulse
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl text-gray-300 max-w-3xl mx-auto mb-8"
          >
            Real-time news and analysis
          </motion.p>
          
          {/* Simple stats like Joe.ie */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-8 mb-12"
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-blue-400" />
                <div className="text-3xl font-bold text-white">24/7</div>
              </div>
              <div className="text-sm text-gray-400">News Coverage</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <div className="text-3xl font-bold text-white">100+</div>
              </div>
              <div className="text-sm text-gray-400">Daily Articles</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-purple-400" />
                <div className="text-3xl font-bold text-white">&lt;5min</div>
              </div>
              <div className="text-sm text-gray-400">To Publish</div>
            </div>
          </motion.div>
        </div>

        {/* Simple category navigation like Joe.ie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {['Technology', 'Business', 'Entertainment', 'Lifestyle', 'Politics', 'Science'].map((category) => (
            <button
              key={category}
              className="px-6 py-3 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white font-medium transition-colors border border-gray-700 hover:border-blue-500/30"
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Simple value proposition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">How It Works</h3>
            <p className="text-gray-300 mb-6">
              We continuously monitor news sources, identify trending topics, 
              and deliver comprehensive articles as they happen.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm text-gray-400">Real-time monitoring</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-sm text-gray-400">Real-time analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                <span className="text-sm text-gray-400">Instant publishing</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}