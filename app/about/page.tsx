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

Trend Pulse is an AI-assisted news analysis platform that helps you keep up with what's happening across technology, business, entertainment, science, and health.

## Our Mission

Staying informed shouldn't mean sifting through dozens of outlets or waiting for a slow news cycle. Trend Pulse tracks breaking stories from established news sources as they happen and turns them into clear, structured analysis: what happened, why it matters, and what to watch next.

## How We Work

### 1. Real-Time Monitoring
We continuously monitor established news sources across our coverage categories to identify emerging stories.

### 2. AI-Generated Analysis
Each article on Trend Pulse is written by an AI system, using the original reporting as its source material. It adds structure — key facts, context, and takeaways — rather than simply repeating the source. We do not maintain a traditional newsroom of staff reporters.

### 3. Rapid Publishing
Because the process is automated, we can publish analysis within minutes of a story breaking.

### 4. Source Attribution
Every article links back to the original reporting it's based on, so you can always read the primary source.

## Contact Us

Have questions or feedback? [Contact us](/contact) via our form, or find us on Twitter [@trendpulse](https://twitter.com/trendpulse) and [LinkedIn](https://linkedin.com/company/trendpulse).

*Last updated: July 2026*`
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