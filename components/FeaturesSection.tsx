'use client';

import { motion } from 'framer-motion';
import { Zap, TrendingUp, Clock, Shield, Globe, Users, BarChart, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Fresh Content',
    description: 'Engaging articles updated multiple times daily with the latest developments.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: TrendingUp,
    title: 'Real-Time Trends',
    description: 'Stay ahead with breaking news and emerging trends across multiple industries.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Clock,
    title: '24/7 Coverage',
    description: 'News coverage around the clock, delivering updates as they happen.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Shield,
    title: 'Quality Assurance',
    description: 'Every article undergoes automated quality checks to ensure accuracy and readability.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: Globe,
    title: 'Global Coverage',
    description: 'Comprehensive coverage of technology, business, entertainment, and lifestyle news worldwide.',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    icon: Users,
    title: 'Reader-Focused',
    description: 'Content tailored to what readers actually want to know, based on real-time data analysis.',
    color: 'from-pink-500 to-rose-500',
  },
];

const howItWorks = [
  {
    step: '1',
    title: 'Trend Monitoring',
    description: 'We continuously monitor news sources for emerging stories and developments.',
  },
  {
    step: '2',
    title: 'Content Creation',
    description: 'Comprehensive, well-researched articles are prepared based on trending topics.',
  },
  {
    step: '3',
    title: 'Quality Review',
    description: 'Every article undergoes checks for accuracy and readability before publishing.',
  },
  {
    step: '4',
    title: 'Rapid Publishing',
    description: 'Articles are published to the site quickly, keeping readers informed in real-time.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white mb-4"
          >
            How We Work
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Delivering fresh news coverage around the clock
          </motion.p>
        </div>

        {/* How it works steps */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * parseInt(item.step) }}
                className="relative"
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                  {item.step}
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 pt-12">
                  <h3 className="font-space text-xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Simple features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.slice(0, 3).map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                className="bg-gray-800/30 border border-gray-700 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg ${feature.color.includes('blue') ? 'bg-blue-500/20' : feature.color.includes('purple') ? 'bg-purple-500/20' : 'bg-green-500/20'} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-medium text-white">{feature.title}</h3>
                </div>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}