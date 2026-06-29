import type { Metadata } from 'next'
import Link from 'next/link'
import ListingCard from '@/components/ListingCard'
import FeaturedSpotlight from '@/components/FeaturedSpotlight'
import NewsletterSignup from '@/components/NewsletterSignup'
import { getFeaturedListings, getAllListings } from '@/lib/listings'
import { CATEGORIES } from '@/lib/categories'
import { GUIDES } from '@/lib/guides'

export const metadata: Metadata = {
  title: 'Dallas Lights — Find Lighting Companies in Dallas, TX',
  description: 'The most complete directory of lighting companies in Dallas, TX. Find residential, commercial, outdoor, and smart home lighting installers near you.',
  alternates: { canonical: 'https://dallaslights.com' },
}

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'DallasLights.com',
  url: 'https://dallaslights.com',
  description: 'Directory of lighting companies in Dallas, TX',
}

export default function HomePage() {
  const featuredPartners = getFeaturedListings()
  // Show the rest in the grid (featured partners get their own big spotlights above).
  const spotlight = getAllListings()
    .filter((l) => !(l.featured || l.tier === 'featured'))
    .slice(0, 6)
  const totalCount = getAllListings().length

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-brand-900 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Find Lighting Companies<br />in Dallas, TX
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
            Browse Dallas's most complete directory of residential, commercial, and outdoor
            lighting professionals. Free quotes from local experts.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
              >
                {cat.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {featuredPartners.map((l) => <FeaturedSpotlight key={l.id} listing={l} />)}

      {/* Why use us */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {[
            { icon: '✓', title: 'Real Local Companies', body: 'Every listing is a genuine Dallas–Fort Worth lighting business, with details from each company.' },
            { icon: '🗺️', title: 'Every Specialty', body: 'Residential, commercial, outdoor, holiday, smart-home, and electrician pros, all in one place.' },
            { icon: '💬', title: 'Free to Use', body: 'Browse companies and request a quote directly — at no cost to you.' },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h2 className="font-bold text-gray-900 mb-2">{item.title}</h2>
              <p className="text-sm text-gray-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Listings spotlight */}
      {spotlight.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-14">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Dallas Lighting Companies</h2>
            <span className="text-sm text-gray-500">{totalCount} listed</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {spotlight.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        </section>
      )}

      {/* Browse categories */}
      <section className="bg-white border-t border-gray-200 py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse by Lighting Type</h2>
          <p className="text-gray-500 mb-8">Find the right specialist for your project in Dallas–Fort Worth.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="group bg-gray-50 hover:bg-brand-50 border border-gray-200 hover:border-brand-300 rounded-xl p-5 transition-all"
              >
                <h3 className="font-bold text-gray-900 group-hover:text-brand-700 mb-1">
                  {cat.title} →
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Guides */}
      {GUIDES.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">DFW Lighting Guides</h2>
          <p className="text-gray-500 mb-6">Local guides to lighting across Dallas–Fort Worth.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GUIDES.map((g) => (
              <Link
                key={g.slug}
                href={`/guides/${g.slug}`}
                className="block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
              >
                <h3 className="font-bold text-gray-900">{g.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{g.excerpt}</p>
                <span className="text-sm text-brand-700 font-medium mt-2 inline-block">Read guide →</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA for businesses */}
      <section className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Own a Lighting Company in DFW?</h2>
        <p className="text-gray-600 mb-6">
          Get your business in front of Dallas–Fort Worth homeowners searching for local lighting services.
          Basic listings are always free.
        </p>
        <Link
          href="/submit"
          className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
        >
          Add Your Business — Free
        </Link>
      </section>

      <NewsletterSignup />
    </>
  )
}
