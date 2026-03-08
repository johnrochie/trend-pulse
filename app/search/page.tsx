import { Metadata } from 'next';
import SearchClient from './SearchClient';

type Props = { searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  if (q?.trim()) {
    return {
      title: `Search results for "${q}" | Trend Pulse`,
      description: `Search results for "${q}" - find news articles and analysis on Trend Pulse.`,
    };
  }
  return {
    title: 'Search Articles | Trend Pulse',
    description: 'Search our archive of news articles, daily digests, and trend analysis.',
  };
}

export default function SearchPage() {
  return <SearchClient />;
}
