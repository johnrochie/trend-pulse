import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

import { config } from '@/lib/config';

// Helper function to get placeholder image for articles
function getPlaceholderImageForArticle(article: any): string {
  const category = article.category?.toLowerCase() || 'technology';
  const width = 800;
  const height = 450;
  
  // Simple deterministic hash based on article ID or title
  function simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
  
  const seed = article.id || article.title || 'default';
  const hashValue = typeof seed === 'number' ? seed : simpleHash(seed);
  
  // Map categories to Unsplash photo IDs
  const categoryPhotos: Record<string, string[]> = {
    'technology': [
      '1499951360447-b19be8fe80f5', // Laptop workspace
      '1550745165-9bc0b252726f', // Tech devices
      '1551288049-bebda4e38f71', // Business meeting
    ],
    'business': [
      '1460925895917-afdab827c52f', // Finance charts
      '1556761175-b413da4baf72', // Office workspace
      '1542744173-8e7e53415bb6', // Team collaboration
    ],
    'finance': [
      '1556761175-4f8b5b5b5b5d', // Business charts
      '1556761175-4f8b5b5b5b5e', // Finance data
    ],
    'entertainment': [
      '1556761175-4f8b5b5b5b5i', // Movie theater
      '1556761175-4f8b5b5b5b5j', // Concert
    ],
    'lifestyle': [
      '1556761175-4f8b5b5b5b5n', // Travel
      '1556761175-4f8b5b5b5b5o', // Food
    ],
  };
  
  const photos = categoryPhotos[category] || categoryPhotos.technology;
  const photoIndex = hashValue % photos.length;
  const selectedPhoto = photos[photoIndex];
  
  return `https://images.unsplash.com/photo-${selectedPhoto}?w=${width}&h=${height}&fit=crop&crop=entropy&q=80&auto=format`;
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
        ];
        
        const isProblematic = problematicPatterns.some(pattern => 
          cleanedArticle.imageUrl.includes(pattern)
        );
        
        if (isProblematic) {
          // Replace problematic image with Unsplash placeholder
          cleanedArticle.imageUrl = getPlaceholderImageForArticle(cleanedArticle);
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