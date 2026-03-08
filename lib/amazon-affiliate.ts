/**
 * Amazon Associates affiliate link utilities
 * @see https://affiliate-program.amazon.com/
 */

import { config } from './config';

/**
 * Build an Amazon product URL with affiliate tag
 * @param asin - Amazon Standard Identification Number (e.g. B09V3KXJPB)
 * @param options - Optional path (default /dp/), locale (default US)
 */
export function getAmazonAffiliateUrl(
  asin: string,
  options?: { path?: '/dp/' | '/gp/product/'; locale?: 'us' | 'uk' | 'de' | 'fr' | 'ca' }
): string {
  if (!asin || typeof asin !== 'string') {
    return '#';
  }
  
  const tag = config.amazon.affiliateTag;
  const path = options?.path ?? '/dp/';
  const locales: Record<string, string> = {
    us: 'amazon.com',
    uk: 'amazon.co.uk',
    de: 'amazon.de',
    fr: 'amazon.fr',
    ca: 'amazon.ca',
  };
  const domain = locales[options?.locale ?? 'us'] || 'amazon.com';
  const baseUrl = `https://www.${domain}${path}${asin}`;
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}tag=${tag}`;
}

/**
 * Append affiliate tag to any Amazon URL (e.g. from markdown links)
 */
export function appendAffiliateTag(url: string): string {
  const tag = config.amazon.affiliateTag;
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes('amazon.')) return url;
    parsed.searchParams.set('tag', tag);
    return parsed.toString();
  } catch {
    return url;
  }
}
