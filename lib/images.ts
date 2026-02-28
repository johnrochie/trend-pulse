// Image utilities for Trend Pulse
// Enhanced version with smart keyword extraction for article-specific images

export interface ImageOptions {
  width?: number;
  height?: number;
  category?: string;
  text?: string;
}

export interface Article {
  id: number | string;
  title: string;
  excerpt?: string;
  content?: string;
  category: string;
  tags?: string[];
  sourceName?: string;
  imageUrl?: string;
}

// Cache for image search results
const imageSearchCache = new Map<string, string>();

/**
 * Get article-specific image using smart keyword extraction
 * Priority: 1. Original source image 2. Keyword-based image 3. Category-based image
 */
export function getArticleImage(article: any): string {
  // Create cache key
  const cacheKey = `article-${article.id}-${article.title}`;
  
  // Check cache first
  if (imageSearchCache.has(cacheKey)) {
    return imageSearchCache.get(cacheKey) || getCategoryBasedImage(article);
  }
  
  // Extract keywords from article
  const keywords = extractKeywordsFromArticle(article);
  
  // Get keyword-influenced image (always use Unsplash for consistency)
  const imageUrl = getKeywordBasedImage(article.category, keywords, article.id);
  
  // Cache the result
  imageSearchCache.set(cacheKey, imageUrl);
  
  return imageUrl;
  
  // Note: We're NOT using article.imageUrl even if it exists because:
  // 1. Source images often block hotlinking
  // 2. Source images have inconsistent sizes/quality
  // 3. Unsplash provides consistent, high-quality, reliable images
  // 4. Better user experience with uniform image styling
}

/**
 * Extract keywords from article for image search
 */
function extractKeywordsFromArticle(article: any): string[] {
  const keywords = new Set<string>();
  
  // Add category
  if (article.category) {
    keywords.add(article.category.toLowerCase());
  }
  
  // Extract from title (most important)
  if (article.title) {
    const titleWords = article.title.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(' ')
      .filter((word: string) => word.length > 3 && !isCommonWord(word));
    
    titleWords.forEach((word: string) => keywords.add(word));
  }
  
  // Extract company/brand names (e.g., Sony, Google, Apple)
  if (article.title) {
    const brandMatches = article.title.match(/\b([A-Z][a-z]+)\b/g);
    if (brandMatches) {
      brandMatches.forEach((brand: string) => {
        if (brand.length > 2 && !isCommonWord(brand.toLowerCase())) {
          keywords.add(brand.toLowerCase());
        }
      });
    }
  }
  
  // Add source name as keyword
  if (article.sourceName) {
    const sourceWords = article.sourceName.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(' ')
      .filter((word: string) => word.length > 2);
    
    sourceWords.forEach((word: string) => keywords.add(word));
  }
  
  // Convert to array and limit
  return Array.from(keywords).slice(0, 5);
}

/**
 * Check if a word is common (to filter out)
 */
function isCommonWord(word: string): boolean {
  const commonWords = [
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'any', 'can',
    'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him',
    'his', 'how', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'did',
    'its', 'let', 'put', 'say', 'she', 'too', 'use', 'why', 'may', 'yes',
    'yet', 'your', 'about', 'after', 'again', 'below', 'could', 'every',
    'first', 'found', 'great', 'house', 'large', 'learn', 'never', 'other',
    'place', 'plant', 'point', 'right', 'small', 'sound', 'spell', 'still',
    'study', 'their', 'there', 'these', 'thing', 'think', 'three', 'water',
    'where', 'which', 'world', 'would', 'write', 'years'
  ];
  
  return commonWords.includes(word.toLowerCase());
}

/**
 * Get keyword-influenced image based on category and keywords
 */
function getKeywordBasedImage(category: string, keywords: string[], articleId: any): string {
  const width = 800;
  const height = 450;
  
  // Category-specific photo collections with keyword influence
  const categoryPhotos: Record<string, string[]> = {
    'technology': [
      '1499951360447-b19be8fe80f5', // Laptop workspace (general tech)
      '1550745165-9bc0b252726f', // Tech devices (phones, gadgets)
      '1551434678-e076c223a692', // Code screen (software, programming)
      '1552664730-d307ca884978', // Data visualization (AI, data)
      '1522071820081-009f0129c71c', // Team collaboration (startups, teams)
      '1444653614773-995cb1ef9efa', // Office workspace (companies)
      '1556761175-b413da4baf72', // Office meeting (business tech)
    ],
    'business': [
      '1551288049-bebda4e38f71', // Business meeting (meetings, deals)
      '1460925895917-afdab827c52f', // Finance charts (stocks, finance)
      '1444653614773-995cb1ef9efa', // Office workspace (companies)
      '1556761175-b413da4baf72', // Office meeting (corporate)
      '1499951360447-b19be8fe80f5', // Laptop workspace (work)
    ],
    'finance': [
      '1460925895917-afdab827c52f', // Finance charts (stocks, investing)
      '1551288049-bebda4e38f71', // Business meeting (banking, deals)
      '1444653614773-995cb1ef9efa', // Office workspace (financial firms)
      '1556761175-b413da4baf72', // Office meeting (financial meetings)
    ],
    'entertainment': [
      '1522071820081-009f0129c71c', // Team collaboration (film crews, production)
      '1551434678-e076c223a692', // Screen (movies, TV, streaming)
      '1499951360447-b19be8fe80f5', // Workspace (editing, production)
      '1550745165-9bc0b252726f', // Devices (streaming devices)
      '1552664730-d307ca884978', // Visualization (music, graphics)
    ],
    'lifestyle': [
      '1550745165-9bc0b252726f', // Devices (tech lifestyle, gadgets)
      '1499951360447-b19be8fe80f5', // Workspace (home office, study)
      '1444653614773-995cb1ef9efa', // Interior (home, living spaces)
      '1522071820081-009f0129c71c', // People (social, activities)
      '1551288049-bebda4e38f71', // Meeting (social gatherings)
    ],
    'health': [
      '1551434678-e076c223a692', // Screen (medical tech, research)
      '1550745165-9bc0b252726f', // Devices (health tech, wearables)
      '1499951360447-b19be8fe80f5', // Workspace (clinic, lab)
      '1522071820081-009f0129c71c', // Team (medical team, research)
      '1551288049-bebda4e38f71', // Meeting (doctor consultation)
    ],
    'sports': [
      '1522071820081-009f0129c71c', // Team (sports teams, athletes)
      '1551434678-e076c223a692', // Screen (sports broadcast, stats)
      '1499951360447-b19be8fe80f5', // Workspace (sports analytics)
      '1550745165-9bc0b252726f', // Devices (sports tech, wearables)
      '1552664730-d307ca884978', // Visualization (sports data)
    ]
  };
  
  // Default to technology if category not found
  const photos = categoryPhotos[category.toLowerCase()] || categoryPhotos['technology'];
  
  // Create seed from keywords and article ID for deterministic selection
  let seed = 0;
  
  // Use keywords to influence selection
  if (keywords.length > 0) {
    const keywordString = keywords.join('');
    for (let i = 0; i < keywordString.length; i++) {
      seed = ((seed << 5) - seed) + keywordString.charCodeAt(i);
      seed = seed & seed;
    }
  }
  
  // Also use article ID for additional variety
  if (articleId) {
    const idStr = String(articleId);
    for (let i = 0; i < idStr.length; i++) {
      seed = ((seed << 5) - seed) + idStr.charCodeAt(i);
      seed = seed & seed;
    }
  }
  
  // Ensure positive index
  const photoIndex = Math.abs(seed) % photos.length;
  const photoId = photos[photoIndex];
  
  return `https://images.unsplash.com/photo-${photoId}?w=${width}&h=${height}&fit=crop&crop=entropy&q=80&auto=format`;
}

/**
 * Fallback: Get category-based image (original logic)
 */
function getCategoryBasedImage(article: any): string {
  const verifiedWorkingPhotos = [
    '1551288049-bebda4e38f71', // Business meeting
    '1460925895917-afdab827c52f', // Finance charts  
    '1550745165-9bc0b252726f', // Tech devices
    '1499951360447-b19be8fe80f5', // Laptop workspace
    '1444653614773-995cb1ef9efa', // Office workspace
    '1556761175-b413da4baf72', // Office meeting
    '1551434678-e076c223a692', // Code screen
    '1552664730-d307ca884978', // Data visualization
  ];
  
  let seed: string | number;
  
  if (article.id && typeof article.id === 'number') {
    seed = article.id;
  } else if (article.id && typeof article.id === 'string') {
    seed = simpleStringHash(article.id);
  } else {
    seed = simpleStringHash(article.title || 'default');
  }
  
  const photoIndex = Math.abs(Number(seed)) % verifiedWorkingPhotos.length;
  const photoId = verifiedWorkingPhotos[photoIndex];
  
  const width = 800;
  const height = 450;
  
  return `https://images.unsplash.com/photo-${photoId}?w=${width}&h=${height}&fit=crop&crop=entropy&q=80&auto=format`;
}

/**
 * Check if URL is a valid image URL
 */
function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  // Check if it's a common image URL pattern
  const imagePatterns = [
    /\.(jpg|jpeg|png|gif|webp|svg)$/i,
    /(unsplash|picsum|placeholder)\.com/i,
    /\.(cloudinary|imgur|flickr)\.com/i,
    /(blob|data):image\//i
  ];
  
  return imagePatterns.some(pattern => pattern.test(url));
}

/**
 * Get optimized image URL
 */
export function getOptimizedImageUrl(url: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpg' | 'png';
} = {}): string {
  const width = options.width || 800;
  const height = options.height || 450;
  const quality = options.quality || 80;
  const format = options.format || 'webp';
  
  // If it's already an Unsplash URL, add params
  if (url.includes('unsplash.com')) {
    return `${url}&w=${width}&h=${height}&fit=crop&crop=entropy&q=${quality}&fm=${format}`;
  }
  
  // For other URLs, return as-is (Next.js Image will optimize)
  return url;
}

/**
 * Get image alt text with keyword context
 */
export function getImageAltText(article: any): string {
  if (article.imageAlt) return article.imageAlt;
  
  // Extract keywords for better alt text
  const keywords = extractKeywordsFromArticle(article);
  const keywordString = keywords.slice(0, 3).join(', ');
  
  const category = article.category || 'general';
  const title = article.title || 'News article';
  const source = article.sourceName ? ` from ${article.sourceName}` : '';
  
  return `${title} - ${category} news article${source}. Features ${keywordString}. Published on Trend Pulse.`;
}

/**
 * Simple string hash function
 */
function simpleStringHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Get a placeholder image URL based on category
 * (For backward compatibility)
 */
export function getPlaceholderImage(options: ImageOptions = {}): string {
  const width = options.width || 800;
  const height = options.height || 450;
  const category = options.category?.toLowerCase() || 'technology';
  
  const mockArticle = {
    id: options.text || 'default',
    title: options.text || 'Default',
    category: category
  };
  
  return getArticleImage(mockArticle);
}

/**
 * Clear image cache (useful for testing)
 */
export function clearImageCache(): void {
  imageSearchCache.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats(): { size: number } {
  return { size: imageSearchCache.size };
}