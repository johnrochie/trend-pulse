import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

import { config } from '@/lib/config';
import { generateArticleMetaDescription, generateArticleTitle } from '@/lib/seo';

// Helper function to fix malformed Unsplash URLs
function fixUnsplashUrl(url: string): string {
  // Fix common issues with Unsplash URLs
  let fixedUrl = url;
  
  // Fix ?w-800 to ?w=800
  if (fixedUrl.includes('?w-')) {
    fixedUrl = fixedUrl.replace('?w-', '?w=');
  }
  
  // Ensure proper query parameters for Next.js Image optimization
  if (fixedUrl.includes('images.unsplash.com')) {
    // Remove any existing query params and add proper ones
    const baseUrl = fixedUrl.split('?')[0];
    return `${baseUrl}?w=800&h=450&fit=crop&crop=entropy&q=80&auto=format`;
  }
  
  return fixedUrl;
}

// Helper function to get placeholder image for articles
function getPlaceholderImageForArticle(article: any): string {
  const width = 800;
  const height = 450;
  
  // ONLY use photo IDs that we have verified work
  // Tested and confirmed working Unsplash photo IDs (all return HTTP 200):
  const verifiedWorkingPhotos = [
    '1551288049-bebda4e38f71', // Business meeting - ✅ VERIFIED WORKING
    '1460925895917-afdab827c52f', // Finance charts - ✅ VERIFIED WORKING  
    '1550745165-9bc0b252726f', // Tech devices - ✅ VERIFIED WORKING
    '1499951360447-b19be8fe80f5', // Laptop workspace - ✅ VERIFIED WORKING
    '1444653614773-995cb1ef9efa', // Office workspace - ✅ VERIFIED WORKING
    '1556761175-b413da4baf72', // Office meeting - ✅ VERIFIED WORKING
    '1551434678-e076c223a692', // Code screen - ✅ VERIFIED WORKING
    '1552664730-d307ca884978', // Data visualization - ✅ VERIFIED WORKING
  ];
  
  // Better deterministic selection - ensure different articles get different images
  // Use article ID if available, otherwise use title hash
  let seed: string | number;
  
  if (article.id && typeof article.id === 'number') {
    // Use article ID directly for variety
    seed = article.id;
  } else if (article.id && typeof article.id === 'string') {
    // Hash string ID
    seed = simpleStringHash(article.id);
  } else {
    // Use title hash
    seed = simpleStringHash(article.title || 'default');
  }
  
  // Ensure we get a good distribution across photos
  const photoIndex = Math.abs(Number(seed)) % verifiedWorkingPhotos.length;
  const photoId = verifiedWorkingPhotos[photoIndex];
  
  return `https://images.unsplash.com/photo-${photoId}?w=${width}&h=${height}&fit=crop&crop=entropy&q=80&auto=format`;
}

/**
 * Simple string hash function that produces good distribution
 */
function simpleStringHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Enhance article with SEO data
 */
function enhanceArticleWithSeo(article: any): any {
  const enhancedArticle = { ...article };
  
  // Generate SEO-optimized title if not present
  if (!enhancedArticle.seoTitle) {
    enhancedArticle.seoTitle = generateArticleTitle(
      enhancedArticle.title || 'Latest News',
      enhancedArticle.category || 'general'
    );
  }
  
  // Generate SEO-optimized meta description if not present
  if (!enhancedArticle.metaDescription) {
    enhancedArticle.metaDescription = generateArticleMetaDescription(
      enhancedArticle.title || 'Latest News',
      enhancedArticle.summary || enhancedArticle.content?.substring(0, 200) || 'Stay informed with the latest news and analysis.',
      enhancedArticle.category || 'general'
    );
  }
  
  // Ensure slug is URL-friendly
  if (enhancedArticle.title && !enhancedArticle.slug) {
    enhancedArticle.slug = enhancedArticle.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/-+/g, '-')      // Remove duplicate hyphens
      .substring(0, 100);       // Limit length
  }
  
  // Add canonical URL
  if (enhancedArticle.slug) {
    enhancedArticle.canonicalUrl = `${config.site.url}/article/${enhancedArticle.slug}`;
  }
  
  // Add Open Graph image URL
  if (enhancedArticle.imageUrl) {
    enhancedArticle.ogImage = enhancedArticle.imageUrl;
  }
  
  // Add publication date if not present
  if (!enhancedArticle.publishedAt) {
    enhancedArticle.publishedAt = new Date().toISOString();
  }
  
  // Add last modified date
  enhancedArticle.updatedAt = new Date().toISOString();
  
  return enhancedArticle;
}

// Path to the automation output
const AUTOMATION_DIR = path.dirname(config.automation.articlesPath);
const ARTICLES_FILE = config.automation.articlesPath;
const API_FILE = config.automation.apiPath;

export async function GET(request: NextRequest) {
  try {
    // Check for query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50;
    const category = searchParams.get('category');
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');

    let data;
    
    // Try to read from API file first
    try {
      const apiContent = await fs.readFile(API_FILE, 'utf-8');
      data = JSON.parse(apiContent);
    } catch (apiError) {
      // Fall back to articles file
      try {
        const articlesContent = await fs.readFile(ARTICLES_FILE, 'utf-8');
        const articlesData = JSON.parse(articlesContent);
        data = {
          success: true,
          data: articlesData.articles || [],
          meta: {
            count: articlesData.articles?.length || 0,
            lastUpdated: articlesData.lastUpdated || new Date().toISOString(),
            source: 'Trend Pulse API (fallback)'
          }
        };
      } catch (articlesError) {
        // Return empty data if no files exist
        return NextResponse.json({
          success: true,
          data: [],
          meta: {
            count: 0,
            lastUpdated: new Date().toISOString(),
            source: 'Trend Pulse API (no data yet)'
          }
        });
      }
    }

    // Filter data based on query parameters
    let filteredData = data.data || [];

    if (id) {
      filteredData = filteredData.filter((article: any) => article.id === parseInt(id));
    }

    if (slug) {
      filteredData = filteredData.filter((article: any) => 
        article.slug?.toLowerCase() === slug.toLowerCase()
      );
    }

    if (category) {
      filteredData = filteredData.filter((article: any) => 
        article.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Apply limit
    filteredData = filteredData.slice(0, limit);

    // Clean up image URLs and enhance with SEO data
    const cleanedData = filteredData.map((article: any) => {
      // Create a copy of the article
      const cleanedArticle = { ...article };
      
      // REPLACE ALL image URLs with our verified Unsplash photos
      // This ensures no broken images and consistent quality
      if (cleanedArticle.imageUrl) {
        // Always use our verified Unsplash photos
        cleanedArticle.imageUrl = getPlaceholderImageForArticle(cleanedArticle);
      }
      
      // Enhance article with SEO data
      return enhanceArticleWithSeo(cleanedArticle);
    });

    // Return response
    return NextResponse.json({
      success: true,
      data: cleanedData,
      meta: {
        ...data.meta,
        filteredCount: cleanedData.length,
        appliedFilters: {
          limit,
          category: category || 'none',
          id: id || 'none',
          slug: slug || 'none'
        }
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch articles',
      message: error instanceof Error ? error.message : 'Unknown error',
      data: [],
      meta: {
        count: 0,
        lastUpdated: new Date().toISOString(),
        source: 'Trend Pulse API (error)'
      }
    }, { status: 500 });
  }
}

// Optional: POST endpoint for manual article addition (for testing)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // In production, you would save to database
    // For now, just acknowledge receipt
    return NextResponse.json({
      success: true,
      message: 'Article received (demo mode)',
      received: body
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Invalid request'
    }, { status: 400 });
  }
}