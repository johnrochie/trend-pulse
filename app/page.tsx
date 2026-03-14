import Hero from '@/components/Hero';
import TrendingArticles from '@/components/TrendingArticles';
import DailyDigestSection from '@/components/DailyDigestSection';
import FeaturesSection from '@/components/FeaturesSection';
import NewsletterSignup from '@/components/NewsletterSignup';
import { config } from '@/lib/config';
import { generateAiFaqSchema } from '@/lib/ai-search';
import { fetchArticles } from '@/lib/articles-api';

export default async function Home() {
  // Fetch article count for Hero (excludes daily digests)
  const response = await fetchArticles({ limit: 500 });
  const allItems = response.success && response.data ? response.data : [];
  const articleCount = allItems.filter(
    (a: { type?: string; slug?: string }) =>
      a.type !== 'daily-digest' && !a.slug?.startsWith('daily-digest-')
  ).length;
  // Structured data for homepage
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.site.name,
    description: config.site.description,
    url: config.site.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${config.site.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: config.site.name,
      logo: `${config.site.url}/logo-simple.svg`,
    },
  };

  // AI search optimized FAQ schema
  const aiFaqSchema = generateAiFaqSchema();

  return (
    <>
      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* AI search optimized FAQ schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aiFaqSchema) }}
      />
      
      <Hero articleCount={articleCount} />
      <TrendingArticles />
      <DailyDigestSection />
      <FeaturesSection />
      <NewsletterSignup />
    </>
  );
}