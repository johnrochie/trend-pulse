/**
 * Product keyword → Amazon ASIN mapping for auto-linking
 * Add entries here to automatically link product mentions in articles to Amazon
 * @see https://www.amazon.com/help/working-with-amazon/contact-us
 */

export const PRODUCT_ASIN_MAP: Record<string, string> = {
  // Gaming
  'PS5': 'B0BCNKKZ91',
  'PlayStation 5': 'B0BCNKKZ91',
  'PlayStation 5 Console': 'B0BCNKKZ91',
  'Xbox Series X': 'B08H75RTZ8',
  'Xbox Series S': 'B08G9J44ZN',
  'Nintendo Switch': 'B0BLXY3YQR',
  'Steam Deck': 'B09V1F4G64',
  'DualSense': 'B08H93ZRLL',
  'DualSense controller': 'B08H93ZRLL',
  // Tech
  'AirPods Pro': 'B0D1XD1ZV3',
  'Apple Watch': 'B0D1X38VWM',
  'MacBook Pro': 'B0CM4L83NY',
  'iPad Pro': 'B0D1ZH3NDW',
  'Kindle': 'B0CX57S52K',
  'Fire TV Stick': 'B0BP9MQM8P',
  'Echo Dot': 'B0D3JQMJ7K',
  'Chromecast': 'B0BSN4VV6Q',
};

/**
 * Process content and replace first occurrence of product terms with affiliate links
 */
export function injectProductLinks(
  content: string,
  getAffiliateUrl: (asin: string) => string
): string {
  let result = content;

  // Sort by length descending so "PlayStation 5" matches before "PS5"
  const terms = Object.keys(PRODUCT_ASIN_MAP).sort((a, b) => b.length - a.length);

  for (const term of terms) {
    const asin = PRODUCT_ASIN_MAP[term];
    const url = getAffiliateUrl(asin);
    const regex = new RegExp(`\\b(${escapeRegex(term)})\\b(?![^\\[]*\\]\\([^)]*amazon)`, 'i');

    const match = result.match(regex);
    if (match) {
      // Replace only first occurrence per term
      result = result.replace(match[0], `[${match[1]}](${url})`);
    }
  }

  return result;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
