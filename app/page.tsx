import Hero from '@/components/Hero';
import TrendingArticles from '@/components/TrendingArticles';
import FeaturesSection from '@/components/FeaturesSection';
import NewsletterSignup from '@/components/NewsletterSignup';

export default function Home() {
  return (
    <>
      <TrendingArticles />
      <Hero />
      <FeaturesSection />
      <NewsletterSignup />
    </>
  );
}