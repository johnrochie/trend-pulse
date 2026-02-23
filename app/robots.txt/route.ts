import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get the base URL from the request
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;
  
  const robotsContent = `# robots.txt for Trend Pulse
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /private/

Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay (optional)
# Crawl-delay: 10

# Ads.txt reference
# Visit: ${baseUrl}/ads.txt`;

  return new NextResponse(robotsContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  });
}