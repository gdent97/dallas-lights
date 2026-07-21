import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ListingCard from '@/components/ListingCard'
import FeaturedSpotlight from '@/components/FeaturedSpotlight'
import { getCategoryMeta, CATEGORIES } from '@/lib/categories'
import { getListingsByCategory } from '@/lib/listings'
import { citiesForCategory } from '@/lib/cities'
import type { Category } from '@/lib/types'

interface Props {
  params: { category: string }
}

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const cat = getCategoryMeta(params.category)
  if (!cat) return {}
  return {
    title: `${cat.title} in Dallas, TX`,
    description: cat.metaDescription,
    alternates: { canonical: `https://www.dallaslights.com/${cat.slug}` },
    openGraph: {
      title: `${cat.title} in Dallas, TX — DallasLights.com`,
      description: cat.metaDescription,
    },
  }
}

export default function CategoryPage({ params }: Props) {
  const cat = getCategoryMeta(params.category)
  if (!cat) notFound()

  const listings = getListingsByCategory(params.category as Category)
  const cities = citiesForCategory(params.category as Category)

  // Pull every featured partner into prominent spotlights above the grid.
  const featuredHere = listings.filter((l) => l.featured || l.tier === 'featured')
  const featuredIds = new Set(featuredHere.map((l) => l.id))
  const rest = listings.filter((l) => !featuredIds.has(l.id))

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: cat.heading,
    url: `https://www.dallaslights.com/${cat.slug}`,
    numberOfItems: listings.length,
    itemListElement: listings.map((l, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://www.dallaslights.com/company/${l.slug}`,
      name: l.name,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 pt-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-800">{cat.title}</span>
      </div>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">{cat.heading}</h1>
        <p className="text-gray-600 max-w-2xl">{cat.description}</p>
      </section>

      {/* Featured partner spotlight(s) — two+ render side by side, equal tier. */}
      {featuredHere.length === 1 && <FeaturedSpotlight listing={featuredHere[0]} />}
      {featuredHere.length > 1 && (
        <section className="max-w-6xl mx-auto px-4 pt-10">
          <div className="grid md:grid-cols-2 gap-6 items-stretch">
            {featuredHere.map((l) => <FeaturedSpotlight key={l.id} listing={l} compact />)}
          </div>
        </section>
      )}

      {/* Listings */}
      <section className="max-w-6xl mx-auto px-4 pb-16 pt-8">
        {listings.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg mb-4">No listings yet for this category.</p>
            <Link href="/submit" className="bg-brand-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-brand-600 transition-colors">
              Be the first to list your business
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-5">{listings.length} companies found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {rest.map((l) => <ListingCard key={l.id} listing={l} />)}
            </div>
          </>
        )}
      </section>

      {/* Browse by city (internal linking) */}
      {cities.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <h2 className="font-bold text-gray-900 mb-3">{cat.title} by city</h2>
          <div className="flex flex-wrap gap-2">
            {cities.map((c) => (
              <Link
                key={c.slug}
                href={`/${cat.slug}/${c.slug}`}
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
              >
                {cat.title} in {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Upgrade CTA */}
      <section className="bg-brand-50 border-t border-brand-100 py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {cat.title} company in Dallas?
          </h2>
          <p className="text-gray-600 text-sm mb-5">
            Get listed for free or upgrade to a Premium placement to appear at the top of this page.
          </p>
          <Link href="/submit" className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors">
            Add Your Listing
          </Link>
        </div>
      </section>
    </>
  )
}
