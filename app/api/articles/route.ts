import { NextRequest, NextResponse } from 'next/server';
import { fetchArticles } from '@/lib/articles-api';

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50;
    const category = searchParams.get('category') || undefined;
    const id = searchParams.get('id') ? parseInt(searchParams.get('id')!) : undefined;
    const slug = searchParams.get('slug') || undefined;

    // Fetch articles using our new service
    const response = await fetchArticles({
      limit,
      category,
      id,
      slug
    });

    // Return the response
    return NextResponse.json(response);

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

// Optional: POST endpoint for manual article addition
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