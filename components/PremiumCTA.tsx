'use client';

import { motion } from 'framer-motion';
import { Check, Zap, TrendingUp, DollarSign, Users, Shield, Clock, Award } from 'lucide-react';

const features = [
  { icon: Zap, text: 'AI Trend Reports (Daily)', highlight: true },
  { icon: TrendingUp, text: 'Investment Opportunity Alerts', highlight: true },
  { icon: DollarSign, text: 'Revenue Tracking Dashboard', highlight: true },
  { icon: Users, text: 'Private Community Access', highlight: false },
  { icon: Shield, text: 'Exclusive Tools & Templates', highlight: false },
  { icon: Clock, text: 'Weekly Expert Q&A Sessions', highlight: false },
  { icon: Award, text: 'Certification Program', highlight: false },
  { icon: TrendingUp, text: 'Market Prediction Models', highlight: false },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'SaaS Founder',
    revenue: '€42K/month',
    text: 'The AI trend reports helped us pivot our pricing model, resulting in 180% revenue growth in 3 months.',
    avatar: 'SC',
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Digital Agency Owner',
    revenue: '€28K/month',
    text: 'The affiliate tracking dashboard alone paid for the premium subscription 10x over. Incredible value.',
    avatar: 'MR',
  },
  {
    name: 'Jessica Park',
    role: 'Content Creator',
    revenue: '€15K/month',
    text: 'Daily trend alerts helped me create viral content that generated €5K in affiliate commissions in one week.',
    avatar: 'JP',
  },
];

export default function PremiumCTA() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-950 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 mb-8"
          >
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            <span className="text-sm font-medium text-yellow-300">LIMITED TIME OFFER</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-space text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
          >
            Go <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400">Premium</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Get the complete toolkit to monetize trends faster than anyone else. Used by 500+ entrepreneurs generating €5M+ in combined revenue.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Pricing card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-500/30 rounded-3xl p-8 shadow-2xl shadow-yellow-500/10">
              {/* Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="px-6 py-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold">
                  MOST POPULAR
                </div>
              </div>

              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-2 mb-4">
                  <span className="text-5xl font-bold text-white">€97</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <p className="text-gray-400">Cancel anytime. 30-day money-back guarantee.</p>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                      feature.highlight
                        ? 'bg-gradient-to-br from-yellow-500 to-orange-500'
                        : 'bg-gray-800 border border-gray-700'
                    }`}>
                      <Check className={`w-3 h-3 ${feature.highlight ? 'text-black' : 'text-gray-400'}`} />
                    </div>
                    <span className={`${feature.highlight ? 'text-white font-semibold' : 'text-gray-300'}`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-orange-500 hover:to-yellow-500 text-black font-bold rounded-xl text-lg transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-yellow-500/25 mb-4">
                Start Premium Trial
              </button>

              <p className="text-center text-gray-500 text-sm">
                Join 500+ premium members. Average ROI: 1,200%
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { value: '500+', label: 'Members' },
                { value: '€5M+', label: 'Revenue' },
                { value: '1,200%', label: 'Avg ROI' },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-4 bg-gray-900 border border-gray-800 rounded-xl">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Testimonials */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="font-space text-3xl font-bold text-white mb-8">What Members Are Saying</h3>
            
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <span className="font-bold text-white">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-bold text-white">{testimonial.name}</h4>
                      <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">
                        {testimonial.revenue}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300">{testimonial.text}</p>
              </div>
            ))}

            {/* Comparison */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h4 className="font-bold text-white mb-4">Free vs Premium</h4>
              <div className="space-y-3">
                {[
                  { feature: 'Daily Trend Reports', free: 'Limited', premium: 'Unlimited' },
                  { feature: 'Revenue Tracking', free: 'Basic', premium: 'Advanced' },
                  { feature: 'Investment Alerts', free: 'None', premium: 'Real-time' },
                  { feature: 'Community Access', free: 'Read-only', premium: 'Full access' },
                  { feature: 'Support', free: 'Email', premium: 'Priority 24/7' },
                ].map((item) => (
                  <div key={item.feature} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                    <span className="text-gray-300">{item.feature}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-500 text-sm">{item.free}</span>
                      <span className="text-green-400 font-semibold">{item.premium}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col items-center gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">Still Have Questions?</div>
              <p className="text-gray-300">
                Book a free 15-minute consultation with our monetization experts.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl font-semibold transition-all hover:scale-105">
                Schedule Free Call
              </button>
              <button className="px-8 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-500/30 text-white rounded-xl font-semibold transition-all">
                View Pricing FAQ
              </button>
            </div>
            <p className="text-gray-500 text-sm">
              No commitment required. We'll show you exactly how to monetize trends in your niche.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}