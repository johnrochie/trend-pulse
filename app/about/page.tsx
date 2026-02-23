import React from 'react';
import { Metadata } from 'next';
import PageTemplate from '@/components/PageTemplate';

export const metadata: Metadata = {
  title: 'About Trend Pulse',
  description: 'Learn about our mission to deliver real-time news and analysis',
};

import { getPage } from '@/lib/api';

async function getPageContent() {
  try {
    const result = await getPage('about');
    return result.data;
  } catch (error) {
    // Fallback content
    return {
      title: 'About Trend Pulse',
      content: `# About Trend Pulse

Trend Pulse is a real-time news and analysis platform dedicated to keeping you informed about the latest developments across technology, business, and entertainment.

## Our Mission

Our mission is simple: deliver timely, accurate, and comprehensive news coverage as events unfold. We believe that staying informed shouldn't require sifting through endless sources or waiting for traditional media cycles.

## How We Work

### 1. Real-Time Monitoring
We continuously monitor news sources, social media, and data feeds to identify emerging stories and trending topics.

### 2. Comprehensive Analysis
Our team and systems analyze developments from multiple angles to provide context and insight beyond the headlines.

### 3. Rapid Publishing
We deliver news quickly, often publishing articles within minutes of major developments.

### 4. Quality Focus
Every article undergoes review to ensure accuracy, readability, and value for our readers.

## Contact Us

Have questions or feedback? We'd love to hear from you:

- **Email:** hello@trendpulse.ai
- **Twitter:** [@trendpulse](https://twitter.com/trendpulse)
- **LinkedIn:** [Trend Pulse](https://linkedin.com/company/trendpulse)

*Last updated: February 2026*`
    };
  }
}

export default async function AboutPage() {
  const page = await getPageContent();

  return (
    <PageTemplate 
      title={page.title || 'About Trend Pulse'}
      content={page.content || ''}
      showStats={true}
      ctaText="Back to Home"
      ctaLink="/"
    />
  );
}