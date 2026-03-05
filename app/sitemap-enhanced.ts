import { MetadataRoute } from 'next'

// This would be your actual article fetching logic
// For now, we'll create a placeholder
async function getArticles() {
  try {
    // In production, fetch from your database or API
    // const response = await fetch('https://www.trendpulse.life/api/articles')
    // return await response.json()
    
    // Placeholder - return empty array for now
    return []
  } catch (error) {
    console.error('Error fetching articles for sitemap:', error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.trendpulse.life'
  const now = new Date()
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/analytics`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/daily-digest`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ]

  // Get articles dynamically
  const articles = await getArticles()
  const articlePages = articles.map((article: any) => ({
    url: `${baseUrl}/articles/${article.slug || article.id}`,
    lastModified: new Date(article.updatedAt || article.createdAt || now),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...articlePages]
}
