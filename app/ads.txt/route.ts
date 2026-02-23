import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    // Read the ads.txt file from public directory
    const filePath = path.join(process.cwd(), 'public', 'ads.txt');
    const content = await fs.readFile(filePath, 'utf-8');
    
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
  } catch (error) {
    console.error('Error serving ads.txt:', error);
    
    // Fallback content
    const fallbackContent = `google.com, pub-9658578792001646, DIRECT, f08c47fec0942fa0`;
    
    return new NextResponse(fallbackContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
  }
}