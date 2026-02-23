import { MetadataRoute } from 'next';
import { config } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/', // API routes
        '/admin/', // Future admin area
        '/private/', // Any private sections
      ],
    },
    sitemap: `${config.site.url}/sitemap.xml`,
    
    // Optional: Host directive (primary domain)
    host: config.site.url.replace(/^https?:\/\//, ''),
  };
}