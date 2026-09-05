import type { Metadata } from 'next'
import { SOCIAL_IMAGE } from '@/lib/seo'
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
    title: `${cat.slug === 'holiday' ? 'Christmas Light Installation' : cat.title} in DFW`,
    description: cat.metaDescription,
    alternates: { canonical: `https://www.dallaslights.com/${cat.slug}` },
    openGraph: {
      url: `https://www.dallaslights.com/${cat.slug}`,
      images: [SOCIAL_IMAGE],
      title: cat.heading,
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
        <p className="text-gray-600 max-w-2xl mb-5">{cat.description}</p>
        <Link
          href={`/get-quotes?service=${cat.slug}`}
          className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
        >
          Request Free Quotes
        </Link>
      </section>

      {cat.slug === 'holiday' && (
        <section className="max-w-6xl mx-auto px-4 pb-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-amber-800 mb-1">Plan before the seasonal rush</p>
              <h2 className="text-xl font-bold text-gray-900">Use the free 2026 DFW holiday lighting checklist</h2>
              <p className="text-sm text-gray-600 mt-1">See when to book, what to compare, and what to confirm before installation.</p>
            </div>
            <Link
              href="/guides/dfw-holiday-lighting-planner"
              className="shrink-0 text-center bg-gray-900 hover:bg-gray-800 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              Open the Planner
            </Link>
          </div>
        </section>
      )}

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

      {(cat.slug === 'holiday' || cat.slug === 'outdoor') && (
        <section className="max-w-6xl mx-auto px-4 pb-12">
          <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {cat.slug === 'holiday' ? 'Compare seasonal Christmas lights and permanent lighting' : 'How to compare landscape lighting proposals'}
            </h2>
            {cat.slug === 'holiday' ? (
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>Seasonal Christmas lighting is installed for the holidays and removed afterward. Permanent lighting stays on the home year-round. Ask whether each installer offers the type you want, and compare the same roofline length and decorations across quotes.</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Seasonal displays:</strong> confirm who owns the lights, whether maintenance and takedown are included, and whether storage costs extra.</li>
                  <li><strong>Permanent systems:</strong> compare the daytime appearance of the track, controls, parts and labor warranties, and who handles repairs.</li>
                  <li><strong>Scheduling:</strong> ask for an installation window and a removal date before booking. Confirm insurance for work on your property directly with the company.</li>
                </ul>
                <Link href="/guides/christmas-light-installation-cost-dallas" className="inline-block text-brand-700 font-semibold hover:underline">Understand Christmas light installation costs in DFW →</Link>
              </div>
            ) : (
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>Start with the areas you want to illuminate: walkways, trees, the front of the home, or a patio. Share the same project scope with each company so you can compare the design and equipment as well as the total price.</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Design:</strong> request examples of completed nighttime projects and ask how the plan limits glare toward windows and neighboring homes.</li>
                  <li><strong>Equipment:</strong> compare fixture counts, materials, light color, transformers, wiring, and timer or app controls.</li>
                  <li><strong>Ongoing care:</strong> ask about adjustments after landscaping changes, replacement parts, and separate equipment and installation warranties.</li>
                </ul>
                <Link href="/guides/landscape-lighting-cost-dallas" className="inline-block text-brand-700 font-semibold hover:underline">Understand landscape lighting costs in DFW →</Link>
              </div>
            )}
            <p className="text-sm text-gray-500 mt-5">Premium and Featured placements are paid advertising. <Link href="/about" className="underline hover:text-gray-900">How our directory works</Link>.</p>
          </div>
        </section>
      )}

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
            {cat.title} company in DFW?
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
