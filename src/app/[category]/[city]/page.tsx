import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ListingCard from '@/components/ListingCard'
import FeaturedSpotlight from '@/components/FeaturedSpotlight'
import { getCategoryMeta } from '@/lib/categories'
import { listingsForCategoryCity, MIN_CITY_PAGE_LISTINGS } from '@/lib/listings'
import { getCityBySlug, getCityCategoryCombos, citiesForCategory } from '@/lib/cities'
import type { Category } from '@/lib/types'

interface Props {
  params: { category: string; city: string }
}

export function generateStaticParams() {
  return getCityCategoryCombos().map((c) => ({ category: c.category, city: c.citySlug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const cat = getCategoryMeta(params.category)
  const city = getCityBySlug(params.city)
  if (!cat || !city) return {}
  const title = `${cat.title} in ${city.name}, TX`
  const description = `Compare ${cat.title.toLowerCase()} companies serving ${city.name}, TX. Browse local lighting pros, see services and areas covered, and request a free quote on DallasLights.com.`
  return {
    title,
    description,
    alternates: { canonical: `https://www.dallaslights.com/${cat.slug}/${city.slug}` },
    openGraph: { title: `${title} — DallasLights.com`, description },
  }
}

export default function CityCategoryPage({ params }: Props) {
  const cat = getCategoryMeta(params.category)
  const city = getCityBySlug(params.city)
  if (!cat || !city) notFound()

  const listings = listingsForCategoryCity(cat.slug, city.name)
  if (listings.length < MIN_CITY_PAGE_LISTINGS) notFound()

  const otherCities = citiesForCategory(cat.slug).filter((c) => c.slug !== city.slug)
  const serviceCounts = new Map<string, number>()
  for (const listing of listings) {
    for (const service of Array.from(new Set(listing.services))) {
      serviceCounts.set(service, (serviceCounts.get(service) || 0) + 1)
    }
  }
  const popularServices = Array.from(serviceCounts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8)
  const cityArticle = /^[aeiou]/i.test(city.name) ? 'an' : 'a'
  const relatedGuide = cat.slug === 'holiday'
    ? { href: '/guides/christmas-light-installation-cost-dallas', label: 'Read the DFW holiday lighting cost guide' }
    : cat.slug === 'outdoor'
      ? { href: '/guides/landscape-lighting-cost-dallas', label: 'Read the DFW landscape lighting cost guide' }
      : undefined

  // Pull the featured partner (if any) into a prominent spotlight above the grid.
  const featuredHere = listings.find((l) => l.featured || l.tier === 'featured')
  const rest = featuredHere ? listings.filter((l) => l.id !== featuredHere.id) : listings

  const faqs = [
    {
      q: `How many ${cat.title.toLowerCase()} companies serve ${city.name}?`,
      a: `DallasLights.com currently lists ${listings.length} ${cat.title.toLowerCase()} ${listings.length === 1 ? 'company' : 'companies'} serving ${city.name}, TX and the surrounding area. You can compare each one's services and areas covered above.`,
    },
    {
      q: `Are these ${city.name} lighting companies licensed and insured?`,
      a: `Licensing and insurance requirements vary by company and by the work being performed. DallasLights.com does not independently verify every company's current status, so ask the company for the credentials relevant to your project before hiring.`,
    },
    {
      q: `How do I get a quote from ${cityArticle} ${city.name} lighting company?`,
      a: `Open any company's profile to see their phone number and website, or send a quote request directly from a Premium listing. Most offer free estimates.`,
    },
  ]

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.dallaslights.com' },
      { '@type': 'ListItem', position: 2, name: cat.title, item: `https://www.dallaslights.com/${cat.slug}` },
      { '@type': 'ListItem', position: 3, name: city.name, item: `https://www.dallaslights.com/${cat.slug}/${city.slug}` },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${cat.title} in ${city.name}, TX`,
    url: `https://www.dallaslights.com/${cat.slug}/${city.slug}`,
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 pt-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">›</span>
        <Link href={`/${cat.slug}`} className="hover:text-gray-800">{cat.title}</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-800">{city.name}</span>
      </div>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
          {cat.title} in {city.name}, TX
        </h1>
        <p className="text-gray-600 max-w-2xl mb-5">
          {listings.length} {cat.title.toLowerCase()} {listings.length === 1 ? 'company' : 'companies'} serving {city.name} and the surrounding Dallas–Fort Worth area. Compare local pros below, see what they offer, and reach out for a free quote.
        </p>
        <Link
          href={`/get-quotes?service=${cat.slug}&city=${city.slug}`}
          className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
        >
          Request Free Quotes in {city.name}
        </Link>
      </section>

      {/* Featured partner spotlight (prominent above the list) */}
      {featuredHere && <FeaturedSpotlight listing={featuredHere} />}

      {/* Listings */}
      <section className="max-w-6xl mx-auto px-4 pb-12 pt-10">
        <p className="text-sm text-gray-500 mb-5">{listings.length} companies serving {city.name}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {rest.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      </section>

      {/* Data-driven comparison help adds useful context beyond a list of names. */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Services offered around {city.name}</h2>
            <p className="text-sm text-gray-600 mb-4">
              These are the most frequently listed services among the companies above. Confirm availability and project fit directly with each company.
            </p>
            <div className="flex flex-wrap gap-2">
              {popularServices.map(([service, count]) => (
                <span key={service} className="text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">
                  {service} <span className="text-gray-400">({count})</span>
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">How to compare lighting companies</h2>
            <ol className="space-y-3 text-sm text-gray-600 list-decimal pl-5">
              <li>Ask for a written scope covering fixtures, installation, controls, warranty, and ongoing maintenance.</li>
              <li>Confirm licensing, insurance, references, and who will perform the work when those matter for your project.</li>
              <li>Compare two or three quotes on the same scope—not price alone.</li>
            </ol>
            {relatedGuide && (
              <Link href={relatedGuide.href} className="inline-block mt-4 text-sm text-brand-700 font-semibold hover:text-brand-800">
                {relatedGuide.label} →
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Other cities (internal linking) */}
      {otherCities.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-12">
          <h2 className="font-bold text-gray-900 mb-3">{cat.title} in other DFW cities</h2>
          <div className="flex flex-wrap gap-2">
            {otherCities.map((c) => (
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

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {cat.title} in {city.name} — FAQ
        </h2>
        <div className="space-y-4 max-w-3xl">
          {faqs.map((f) => (
            <div key={f.q} className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-1">{f.q}</h3>
              <p className="text-sm text-gray-600">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Upgrade CTA */}
      <section className="bg-brand-50 border-t border-brand-100 py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {cat.title} company serving {city.name}?
          </h2>
          <p className="text-gray-600 text-sm mb-5">
            Get listed free, or upgrade to Premium to appear at the top of {city.name} results.
          </p>
          <Link href="/submit" className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors">
            Add Your Listing
          </Link>
        </div>
      </section>
    </>
  )
}
