import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

import { config } from '@/lib/config';

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
  
  // Simple, reliable set of Unsplash photos that definitely work
  const reliablePhotos = [
    '1551288049-bebda4e38f71', // Business meeting - proven working
    '1460925895917-afdab827c52f', // Finance charts - proven working  
    '1550745165-9bc0b252726f', // Tech devices
    '1499951360447-b19be8fe80f5', // Laptop workspace
  ];
  
  // Simple deterministic selection
  const seed = article.id || article.title || 'default';
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash = hash & hash;
  }
  const photoIndex = Math.abs(hash) % reliablePhotos.length;
  const photoId = reliablePhotos[photoIndex];
  
  return `https://images.unsplash.com/photo-${photoId}?w=${width}&h=${height}&fit=crop&crop=entropy&q=80&auto=format`;
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

    // Clean up image URLs before returning
    const cleanedData = filteredData.map((article: any) => {
      // Create a copy of the article
      const cleanedArticle = { ...article };
      
      // Check if imageUrl is problematic
      if (cleanedArticle.imageUrl) {
        const problematicPatterns = [
          'images.ft.com/v3/image/raw',
          '%3A%2F%2F', // Encoded ://
          '?source=next-barrier-page',
          'i0.wp.com', // WordPress CDN
          'www.theglobeandmail.com', // News site
          'www.thedailybeast.com', // News site
          'media-cldnry.s-nbcnews.com', // News CDN
          'deadline.com', // News site
          'fdn.gsmarena.com', // Tech site
        ];
        
        // Also check for malformed Unsplash URLs
        const isMalformedUnsplash = cleanedArticle.imageUrl.includes('images.unsplash.com') && 
          (cleanedArticle.imageUrl.includes('?w-') || !cleanedArticle.imageUrl.includes('?w='));
        
        const isProblematic = problematicPatterns.some(pattern => 
          cleanedArticle.imageUrl.includes(pattern)
        ) || isMalformedUnsplash;
        
        if (isProblematic) {
          // Replace problematic image with Unsplash placeholder
          cleanedArticle.imageUrl = getPlaceholderImageForArticle(cleanedArticle);
        } else if (cleanedArticle.imageUrl.includes('images.unsplash.com')) {
          // Fix malformed Unsplash URLs
          cleanedArticle.imageUrl = fixUnsplashUrl(cleanedArticle.imageUrl);
        }
      }
      
      return cleanedArticle;
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