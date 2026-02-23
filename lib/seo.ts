/**
 * SEO Utility Functions for Trend Pulse
 * 
 * Provides functions for generating SEO-optimized meta tags,
 * descriptions, titles, and structured data.
 */

import { config } from './config';

/**
 * Generate a unique, SEO-optimized meta description for an article
 */
export function generateArticleMetaDescription(
  title: string,
  summary: string,
  category: string
): string {
  // Clean and truncate summary for meta description
  const cleanSummary = summary
    .replace(/[^\w\s.,!?-]/g, ' ') // Remove special characters
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .trim()
    .substring(0, 150); // Keep within 150 characters for preview

  // Build SEO-optimized description
  const keywords = getCategoryKeywords(category);
  const date = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return `${title}. ${cleanSummary} Read our latest ${category.toLowerCase()} news and analysis for ${date}. ${keywords.join(', ')}. Stay informed with Trend Pulse.`;
}

/**
 * Get relevant keywords for a category
 */
export function getCategoryKeywords(category: string): string[] {
  const keywordMap: Record<string, string[]> = {
    'technology': ['tech news', 'AI', 'innovation', 'digital trends', 'software', 'hardware'],
    'business': ['business news', 'market trends', 'economy', 'finance', 'startups', 'investing'],
    'entertainment': ['entertainment news', 'movies', 'TV shows', 'celebrities', 'streaming'],
    'lifestyle': ['lifestyle trends', 'health', 'wellness', 'culture', 'travel', 'food'],
    'politics': ['political news', 'government', 'policy', 'elections', 'legislation'],
    'sports': ['sports news', 'games', 'athletes', 'teams', 'scores', 'highlights']
  };

  return keywordMap[category.toLowerCase()] || ['news', 'trends', 'analysis', 'updates'];
}

/**
 * Generate SEO-optimized article title
 */
export function generateArticleTitle(
  baseTitle: string,
  category: string
): string {
  const categoryFormatted = category.charAt(0).toUpperCase() + category.slice(1);
  return `${baseTitle} | ${categoryFormatted} News & Analysis - Trend Pulse`;
}

/**
 * Generate canonical URL for a page
 */
export function generateCanonicalUrl(path: string): string {
  // Remove trailing slash and ensure proper formatting
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${config.site.url}${cleanPath}`.replace(/\/$/, '');
}

/**
 * Generate Open Graph meta tags for an article
 */
export function generateOpenGraphTags(
  title: string,
  description: string,
  imageUrl: string,
  path: string
) {
  const url = generateCanonicalUrl(path);
  
  return {
    'og:title': title,
    'og:description': description.substring(0, 200),
    'og:image': imageUrl,
    'og:url': url,
    'og:type': 'article',
    'og:site_name': config.site.name,
    'og:locale': 'en_US',
  };
}

/**
 * Generate Twitter Card meta tags
 */
export function generateTwitterCardTags(
  title: string,
  description: string,
  imageUrl: string
) {
  return {
    'twitter:card': 'summary_large_image',
    'twitter:site': '@trendpulse',
    'twitter:creator': '@trendpulse',
    'twitter:title': title,
    'twitter:description': description.substring(0, 200),
    'twitter:image': imageUrl,
  };
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbSchema(path: string, title: string) {
  const url = generateCanonicalUrl(path);
  const pathSegments = path.split('/').filter(segment => segment);
  
  const itemListElement = pathSegments.map((segment, index) => {
    const segmentPath = '/' + pathSegments.slice(0, index + 1).join('/');
    const segmentName = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return {
      '@type': 'ListItem',
      'position': index + 1,
      'name': segmentName,
      'item': `${config.site.url}${segmentPath}`
    };
  });

  // Add homepage as first item
  itemListElement.unshift({
    '@type': 'ListItem',
    'position': 1,
    'name': 'Home',
    'item': config.site.url
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': itemListElement
  };
}

/**
 * Generate FAQ schema for a page
 */
export function generateFaqSchema(questions: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': questions.map(({ question, answer }) => ({
      '@type': 'Question',
      'name': question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': answer
      }
    }))
  };
}

/**
 * Generate organization schema
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': config.site.name,
    'url': config.site.url,
    'logo': `${config.site.url}/logo.svg`,
    'sameAs': [
      'https://twitter.com/trendpulse',
      // Add other social profiles as they're created
    ],
    'description': config.site.description
  };
}

/**
 * Generate website schema
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': config.site.name,
    'url': config.site.url,
    'description': config.site.description,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': `${config.site.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
}

/**
 * Generate news article schema
 */
export function generateNewsArticleSchema(
  headline: string,
  description: string,
  imageUrl: string,
  datePublished: string,
  dateModified: string,
  author: string,
  publisher: string = config.site.name
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': headline,
    'description': description,
    'image': imageUrl,
    'datePublished': datePublished,
    'dateModified': dateModified,
    'author': {
      '@type': 'Organization',
      'name': author
    },
    'publisher': {
      '@type': 'Organization',
      'name': publisher,
      'logo': {
        '@type': 'ImageObject',
        'url': `${config.site.url}/logo.svg`
      }
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': config.site.url
    }
  };
}

/**
 * Generate meta tags string for HTML head
 */
export function generateMetaTagsString(tags: Record<string, string>): string {
  return Object.entries(tags)
    .map(([property, content]) => {
      if (property.startsWith('og:')) {
        return `<meta property="${property}" content="${content}" />`;
      } else if (property.startsWith('twitter:')) {
        return `<meta name="${property}" content="${content}" />`;
      } else {
        return `<meta name="${property}" content="${content}" />`;
      }
    })
    .join('\n    ');
}

/**
 * Check if a string is SEO-friendly
 */
export function isSeoFriendly(text: string, minLength: number = 50, maxLength: number = 300): boolean {
  const wordCount = text.split(/\s+/).length;
  const charCount = text.length;
  
  return (
    wordCount >= 10 &&
    charCount >= minLength &&
    charCount <= maxLength &&
    !text.includes('click here') &&
    !text.includes('read more') &&
    text.includes(' ') // Not just a single word
  );
}

/**
 * Generate alt text for images
 */
export function generateImageAltText(
  imageContext: string,
  category: string,
  keywords: string[] = []
): string {
  const baseAlt = `${imageContext} - ${category} news and trends`;
  
  if (keywords.length > 0) {
    const keywordString = keywords.slice(0, 3).join(', ');
    return `${baseAlt}. Related to ${keywordString}.`;
  }
  
  return baseAlt;
}