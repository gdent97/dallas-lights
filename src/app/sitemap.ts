import type { MetadataRoute } from 'next'
import { CATEGORIES } from '@/lib/categories'
import { LISTINGS } from '@/lib/listings'

const BASE = 'https://dallaslights.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/submit`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ]

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${BASE}/${cat.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  const listingRoutes: MetadataRoute.Sitemap = LISTINGS.map((l) => ({
    url: `${BASE}/company/${l.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: l.tier === 'featured' ? 0.8 : l.tier === 'premium' ? 0.7 : 0.6,
  }))

  return [...staticRoutes, ...categoryRoutes, ...listingRoutes]
}
