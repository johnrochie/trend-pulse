import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const PAGES_DIR = path.join(process.cwd(), 'content', 'pages');

// Define the expected frontmatter structure
interface PageFrontmatter {
  title?: string;
  description?: string;
  slug?: string;
  order?: number;
  [key: string]: any; // Allow other properties
}

interface PageData extends PageFrontmatter {
  content: string;
  file: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get('slug');
    const list = searchParams.get('list') === 'true';

    // Get all page files
    const files = await fs.readdir(PAGES_DIR);
    const pages: PageData[] = [];

    for (const file of files) {
      if (!file.endsWith('.md')) continue;

      const filePath = path.join(PAGES_DIR, file);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const { data: frontmatter, content } = matter(fileContent) as { data: PageFrontmatter; content: string };

      const page: PageData = {
        ...frontmatter,
        content,
        file
      };

      // If slug is specified, return only that page
      if (slug && frontmatter.slug === slug) {
        return NextResponse.json({
          success: true,
          data: page
        });
      }

      pages.push(page);
    }

    // Sort by order if specified
    pages.sort((a, b) => (a.order || 999) - (b.order || 999));

    // If list=true, return just metadata
    if (list) {
      const metadata = pages.map(({ content, file, ...meta }) => meta);
      return NextResponse.json({
        success: true,
        data: metadata,
        meta: {
          count: metadata.length
        }
      });
    }

    // Return all pages with content
    return NextResponse.json({
      success: true,
      data: pages,
      meta: {
        count: pages.length
      }
    });

  } catch (error) {
    console.error('Pages API Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch pages',
      message: error instanceof Error ? error.message : 'Unknown error',
      data: []
    }, { status: 500 });
  }
}