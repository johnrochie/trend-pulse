'use client';

import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Users, BarChart, Zap, Target, Repeat, Rocket } from 'lucide-react';

const revenueStreams = [
  {
    icon: DollarSign,
    title: 'Google AdSense',
    description: 'Display advertising revenue based on traffic and engagement.',
    examples: ['Display Ads', 'Native Advertising', 'Video Ads', 'Sponsored Content'],
    monthlyPotential: '€5K - €50K',
    difficulty: 'Beginner',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Users,
    title: 'Affiliate Marketing',
    description: 'Commission-based revenue from product recommendations.',
    examples: ['Amazon Associates', 'Tech Product Affiliates', 'Service Recommendations', 'Tool Referrals'],
    monthlyPotential: '€2K - €20K',
    difficulty: 'Beginner',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: BarChart,
    title: 'Sponsored Content',
    description: 'Brands pay for featured articles and native advertising.',
    examples: ['Brand Partnerships', 'Product Placements', 'Expert Interviews', 'Case Studies'],
    monthlyPotential: '€10K - €100K',
    difficulty: 'Intermediate',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Target,
    title: 'Newsletter Sponsorships',
    description: 'Email newsletter advertising to engaged subscribers.',
    examples: ['Weekly Digest Sponsors', 'Breaking News Sponsors', 'Category Sponsors', 'Exclusive Content'],
    monthlyPotential: '€8K - €40K',
    difficulty: 'Intermediate',
    color: 'from-orange-500 to-red-500',
  },
];

const caseStudies = [
  {
    name: 'AI Tools Blog',
    niche: 'AI Content Creation',
    timeline: '6 months',
    investment: '€2,000',
    monthlyRevenue: '€15,200',
    streams: ['Affiliate (60%)', 'Sponsorships (30%)', 'Consulting (10%)'],
    growth: '+320%',
  },
  {
    name: 'SaaS Growth',
    niche: 'SaaS Marketing',
    timeline: '9 months',
    investment: '€3,500',
    monthlyRevenue: '€28,500',
    streams: ['Lead Gen (40%)', 'Affiliate (35%)', 'Premium (25%)'],
    growth: '+180%',
  },
  {
    name: 'Web3 Insights',
    niche: 'Crypto Marketing',
    timeline: '4 months',
    investment: '€1,500',
    monthlyRevenue: '€42,800',
    streams: ['Sponsorships (50%)', 'Consulting (30%)', 'Affiliate (20%)'],
    growth: '+150%',
  },
];

const tools = [
  { name: 'Trend Monitoring', icon: TrendingUp, description: 'AI-powered trend detection' },
  { name: 'Revenue Tracking', icon: DollarSign, description: 'Real-time affiliate earnings' },
  { name: 'Audience Analytics', icon: Users, description: 'Demographic & behavior data' },
  { name: 'Competitor Analysis', icon: Target, description: 'Market positioning insights' },
  { name: 'Content Automation', icon: Repeat, description: 'Auto-publishing workflows' },
  { name: 'Growth Forecasting', icon: Rocket, description: 'Revenue projection models' },
];

export default function MonetizationSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-space text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
          >
            News Site Monetization
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Multiple revenue streams for sustainable news publishing. Turn traffic into predictable advertising and affiliate income.
          </motion.p>
        </div>

        {/* Revenue streams */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {revenueStreams.map((stream, index) => (
            <motion.div
              key={stream.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10 transition-all"
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${stream.color} mb-6`}>
                <stream.icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="font-space text-xl font-bold text-white mb-3">{stream.title}</h3>
              <p className="text-gray-300 mb-4">{stream.description}</p>

              {/* Examples */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-400 mb-2">Top Examples:</h4>
                <div className="flex flex-wrap gap-2">
                  {stream.examples.map((example) => (
                    <span
                      key={example}
                      className="px-3 py-1 rounded-full bg-gray-700 text-gray-300 text-sm"
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-400">Monthly Potential</div>
                  <div className="text-lg font-bold text-white">{stream.monthlyPotential}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Difficulty</div>
                  <div className={`text-sm font-semibold ${
                    stream.difficulty === 'Beginner' ? 'text-green-400' :
                    stream.difficulty === 'Intermediate' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {stream.difficulty}
                  </div>
                </div>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:via-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 -z-10" />
            </motion.div>
          ))}
        </div>

        {/* Case studies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="font-space text-3xl font-bold text-white mb-8 text-center">Real Revenue Case Studies</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <div
                key={study.name}
                className="bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:border-blue-500/30 transition-all"
              >
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-space text-xl font-bold text-white">{study.name}</h4>
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-semibold">
                    {study.growth}
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Niche:</span>
                    <span className="text-white font-medium">{study.niche}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Timeline:</span>
                    <span className="text-white font-medium">{study.timeline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Investment:</span>
                    <span className="text-white font-medium">{study.investment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Monthly Revenue:</span>
                    <span className="text-2xl font-bold text-green-400">{study.monthlyRevenue}</span>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-semibold text-gray-400 mb-2">Revenue Streams:</h5>
                  <div className="space-y-2">
                    {study.streams.map((stream) => (
                      <div key={stream} className="flex items-center justify-between">
                        <span className="text-gray-300">{stream.split(' (')[0]}</span>
                        <span className="text-blue-300">{stream.split(' (')[1].replace(')', '')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="font-space text-3xl font-bold text-white mb-8 text-center">Built-In Monetization Tools</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {tools.map((tool, index) => (
              <div
                key={tool.name}
                className="text-center p-6 bg-gray-800 border border-gray-700 rounded-xl hover:border-blue-500/30 hover:bg-gradient-to-br hover:from-blue-900/10 hover:to-purple-900/10 transition-all"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 mb-4">
                  <tool.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">{tool.name}</h4>
                <p className="text-sm text-gray-400">{tool.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-8 p-8 bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-2xl">
            <div className="text-left">
              <h3 className="font-space text-2xl font-bold text-white mb-2">Ready to Monetize Trends?</h3>
              <p className="text-gray-300">
                Get access to our complete monetization toolkit and revenue tracking dashboard.
              </p>
            </div>
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl font-semibold text-lg transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 whitespace-nowrap">
              Start Free Trial
            </button>
          </div>
          <p className="text-gray-500 text-sm mt-4">
            Includes affiliate tracking, revenue analytics, and trend monitoring
          </p>
        </motion.div>
      </div>
    </section>
  );
}