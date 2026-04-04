import Hero from '@/components/Hero';
import TrendingArticles from '@/components/TrendingArticles';
import DailyDigestSection from '@/components/DailyDigestSection';
import FeaturesSection from '@/components/FeaturesSection';
import NewsletterSignup from '@/components/NewsletterSignup';
import { config } from '@/lib/config';
import { generateAiFaqSchema } from '@/lib/ai-search';
import { fetchArticles } from '@/lib/articles-api';

// Regenerate every 5 minutes so new articles appear promptly after each automation run
export const revalidate = 300;

export default async function Home() {
  // Fetch articles for Hero featured section + count
  const response = await fetchArticles({ limit: 100 });
  const allItems = response.success && response.data ? response.data : [];
  const articles = allItems.filter(
    (a: { type?: string; slug?: string }) =>
      a.type !== 'daily-digest' && !a.slug?.startsWith('daily-digest-')
  );
  const articleCount = articles.length;
  // Top 4 most recent for the hero featured section
  const featuredArticles = articles.slice(0, 4);
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
      
      <Hero articleCount={articleCount} featuredArticles={featuredArticles} />
      <TrendingArticles />
      <DailyDigestSection />
      <FeaturesSection />
      <NewsletterSignup />
    </>
  );
}