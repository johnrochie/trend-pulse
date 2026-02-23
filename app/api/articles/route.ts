import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

import { config } from '@/lib/config';

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

    // Return response
    return NextResponse.json({
      success: true,
      data: filteredData,
      meta: {
        ...data.meta,
        filteredCount: filteredData.length,
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