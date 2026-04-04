import { MetadataRoute } from 'next'
import { fetchArticles } from '@/lib/articles-api'
import { tagToSlug } from '@/lib/tag-utils'
import { config } from '@/lib/config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = config.site.url
  const now = new Date()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
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
      url: `${baseUrl}/articles`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/briefings`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/quiz`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/daily-digest`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
  ]

  // Article pages + Daily Digest pages + Topic pages
  let articlePages: MetadataRoute.Sitemap = []
  let digestPages: MetadataRoute.Sitemap = []
  let topicPages: MetadataRoute.Sitemap = []
  try {
    const res = await fetchArticles({ limit: 200 })
    if (res.success && res.data?.length) {
      const articles = res.data.filter((a: { slug?: string; type?: string }) =>
        !a.slug?.startsWith('daily-digest-') && a.type !== 'daily-digest'
      )
      const digests = res.data.filter((a: { slug?: string; type?: string }) =>
        a.slug?.startsWith('daily-digest-') || a.type === 'daily-digest'
      )
      articlePages = articles.map((a: { slug: string; updatedAt?: string }) => ({
        url: `${baseUrl}/article/${a.slug}`,
        lastModified: a.updatedAt ? new Date(a.updatedAt) : now,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
      digestPages = digests.map((a: { slug: string; publishedAt?: string; updatedAt?: string }) => {
        const date = a.slug.replace('daily-digest-', '')
        return {
          url: `${baseUrl}/daily-digest/${date}`,
          lastModified: (a.updatedAt || a.publishedAt) ? new Date(a.updatedAt || a.publishedAt!) : now,
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }
      })

      // Collect unique tag slugs from all non-digest articles
      const tagSlugSet = new Set<string>()
      for (const article of articles) {
        if (!Array.isArray((article as any).tags)) continue
        for (const tag of (article as any).tags as string[]) {
          const slug = tagToSlug(tag)
          if (slug) tagSlugSet.add(slug)
        }
      }
      topicPages = [
        {
          url: `${baseUrl}/topic`,
          lastModified: now,
          changeFrequency: 'daily' as const,
          priority: 0.7,
        },
        ...Array.from(tagSlugSet).map((slug) => ({
          url: `${baseUrl}/topic/${slug}`,
          lastModified: now,
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        })),
      ]
    }
  } catch {
    // ignore
  }

  return [...staticPages, ...articlePages, ...digestPages, ...topicPages]
}
