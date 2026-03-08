import Link from 'next/link';
import { getAmazonAffiliateUrl } from '@/lib/amazon-affiliate';

interface AmazonProductLinkProps {
  asin: string;
  children: React.ReactNode;
  className?: string;
  path?: '/dp/' | '/gp/product/';
  locale?: 'us' | 'uk' | 'de' | 'fr' | 'ca';
}

/**
 * Renders an Amazon product link with affiliate tag
 */
export default function AmazonProductLink({
  asin,
  children,
  className = 'text-blue-400 hover:text-blue-300 underline transition-colors',
  path,
  locale,
}: AmazonProductLinkProps) {
  const href = getAmazonAffiliateUrl(asin, { path, locale });
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={className}
    >
      {children}
    </Link>
  );
}
