// Image utilities for Trend Pulse
// Provides placeholder images and image generation helpers

export interface ImageOptions {
  width?: number;
  height?: number;
  category?: string;
  text?: string;
}

/**
 * Get a placeholder image URL based on category
 * Uses Unsplash for high-quality placeholder images
 */
export function getPlaceholderImage(options: ImageOptions = {}): string {
  const width = options.width || 800;
  const height = options.height || 450;
  const category = options.category?.toLowerCase() || 'technology';
  
  // Map categories to Unsplash collections
  const categoryMap: Record<string, string> = {
    'technology': 'technology',
    'tech': 'technology',
    'business': 'business',
    'finance': 'business',
    'entertainment': 'entertainment',
    'lifestyle': 'lifestyle',
    'health': 'health',
    'science': 'science',
    'sports': 'sports',
    'politics': 'politics',
    'default': 'abstract'
  };
  
  const unsplashCategory = categoryMap[category] || categoryMap.default;
  
  // Return Unsplash placeholder with category
  return `https://images.unsplash.com/photo-${getRandomPhotoId()}?w=${width}&h=${height}&fit=crop&crop=entropy&q=80&auto=format`;
}

/**
 * Get a random photo ID for Unsplash (pre-selected tech/business images)
 */
function getRandomPhotoId(): string {
  const techPhotos = [
    '1499951360447-b19be8fe80f5', // Laptop workspace
    '1550745165-9bc0b252726f', // Tech devices
    '1460925895917-afdab827c52f', // Finance charts
    '1551288049-bebda4e38f71', // Business meeting
    '1556761175-b413da4baf72', // Office workspace
    '1542744173-8e7e53415bb6', // Team collaboration
    '1551434678-e076c223a692', // Code screen
    '1552664730-d307ca884978', // Data visualization
    '1556761175-4f8b5b5b5b5b', // Startup office
    '1556761175-4f8b5b5b5b5c', // Modern office
  ];
  
  const businessPhotos = [
    '1556761175-4f8b5b5b5b5d', // Business charts
    '1556761175-4f8b5b5b5b5e', // Finance data
    '1556761175-4f8b5b5b5b5f', // Stock market
    '1556761175-4f8b5b5b5b5g', // Economy
    '1556761175-4f8b5b5b5b5h', // Investment
  ];
  
  const entertainmentPhotos = [
    '1556761175-4f8b5b5b5b5i', // Movie theater
    '1556761175-4f8b5b5b5b5j', // Concert
    '1556761175-4f8b5b5b5b5k', // TV production
    '1556761175-4f8b5b5b5b5l', // Gaming
    '1556761175-4f8b5b5b5b5m', // Streaming
  ];
  
  const lifestylePhotos = [
    '1556761175-4f8b5b5b5b5n', // Travel
    '1556761175-4f8b5b5b5b5o', // Food
    '1556761175-4f8b5b5b5b5p', // Fitness
    '1556761175-4f8b5b5b5b5q', // Home
    '1556761175-4f8b5b5b5b5r', // Fashion
  ];
  
  // Combine all photos
  const allPhotos = [...techPhotos, ...businessPhotos, ...entertainmentPhotos, ...lifestylePhotos];
  
  // Return random photo ID
  return allPhotos[Math.floor(Math.random() * allPhotos.length)];
}

/**
 * Generate an image URL for an article
 */
export function getArticleImage(article: any): string {
  // If article has an imageUrl, use it
  if (article.imageUrl && article.imageUrl.trim() !== '') {
    return article.imageUrl;
  }
  
  // Otherwise generate a placeholder based on category
  return getPlaceholderImage({
    width: 800,
    height: 450,
    category: article.category,
    text: article.title.substring(0, 30)
  });
}

/**
 * Get optimized image URL with parameters
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
 * Get image alt text for accessibility
 */
export function getImageAltText(article: any): string {
  if (article.imageAlt) return article.imageAlt;
  return `${article.title} - ${article.category} news article`;
}