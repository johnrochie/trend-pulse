// Configuration utilities for Trend Pulse

export const config = {
  // Site configuration
  site: {
    name: process.env.NEXT_PUBLIC_SITE_NAME || 'Trend Pulse',
    description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Real-time news and analysis',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:4002',
  },
  
  // API configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4002/api',
    articles: '/articles',
    pages: '/pages',
  },
  
  // Automation paths (server-side only)
  automation: {
    articlesPath: process.env.AUTOMATION_ARTICLES_PATH || '/home/jr/.openclaw/workspace/trend-pulse-automation/output/articles.json',
    apiPath: process.env.AUTOMATION_API_PATH || '/home/jr/.openclaw/workspace/trend-pulse-automation/output/api/articles.json',
  },
  
  // Environment
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // Analytics
  analytics: {
    gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
  },
  
  // Newsletter
  newsletter: {
    apiKey: process.env.NEXT_PUBLIC_NEWSLETTER_API_KEY || '',
    formId: process.env.NEXT_PUBLIC_NEWSLETTER_FORM_ID || '',
  },
};

// Helper function to get API URL
export function getApiUrl(endpoint: string): string {
  const baseUrl = config.api.baseUrl;
  return `${baseUrl}${endpoint}`;
}

// Helper function to get site URL
export function getSiteUrl(path: string = ''): string {
  const baseUrl = config.site.url;
  return `${baseUrl}${path}`;
}

// Check if running on server
export const isServer = typeof window === 'undefined';