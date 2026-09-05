import type { MetadataRoute } from 'next'
import { CATEGORIES } from '@/lib/categories'
import { LISTINGS } from '@/lib/listings'
import { getCityCategoryCombos } from '@/lib/cities'
import { GUIDES } from '@/lib/guides'

const BASE = 'https://www.dallaslights.com'

export default function sitemap(): MetadataRoute.Sitemap {
  // Omit lastModified until actual page revision dates are tracked.
  // Deployment time is not the date every page meaningfully changed.

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/get-quotes`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/submit`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/advertise`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/about`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/contact`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/terms`, changeFrequency: 'yearly', priority: 0.2 },
  ]

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${BASE}/${cat.slug}`,
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  const listingRoutes: MetadataRoute.Sitemap = LISTINGS.map((l) => ({
    url: `${BASE}/company/${l.slug}`,
    changeFrequency: 'monthly',
    priority: l.tier === 'featured' ? 0.8 : l.tier === 'premium' ? 0.7 : 0.6,
  }))

  const cityCategoryRoutes: MetadataRoute.Sitemap = getCityCategoryCombos().map((c) => ({
    url: `${BASE}/${c.category}/${c.citySlug}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const guideRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/guides`, changeFrequency: 'monthly', priority: 0.6 },
    ...GUIDES.map((g) => ({
      url: `${BASE}/guides/${g.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]

  return [...staticRoutes, ...categoryRoutes, ...cityCategoryRoutes, ...guideRoutes, ...listingRoutes]
}
