import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ListingCard from '@/components/ListingCard'
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
    alternates: { canonical: `https://dallaslights.com/${cat.slug}/${city.slug}` },
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

  const faqs = [
    {
      q: `How many ${cat.title.toLowerCase()} companies serve ${city.name}?`,
      a: `DallasLights.com currently lists ${listings.length} ${cat.title.toLowerCase()} ${listings.length === 1 ? 'company' : 'companies'} serving ${city.name}, TX and the surrounding area. You can compare each one's services and areas covered above.`,
    },
    {
      q: `Are these ${city.name} lighting companies licensed and insured?`,
      a: `Most professional lighting companies in the Dallas–Fort Worth area carry licensing and insurance, but it varies by company and service. Always confirm directly with the company before hiring.`,
    },
    {
      q: `How do I get a quote from a ${city.name} lighting company?`,
      a: `Open any company's profile to see their phone number and website, or send a quote request directly from a Premium listing. Most offer free estimates.`,
    },
  ]

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://dallaslights.com' },
      { '@type': 'ListItem', position: 2, name: cat.title, item: `https://dallaslights.com/${cat.slug}` },
      { '@type': 'ListItem', position: 3, name: city.name, item: `https://dallaslights.com/${cat.slug}/${city.slug}` },
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

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
        <p className="text-gray-600 max-w-2xl">
          {listings.length} {cat.title.toLowerCase()} {listings.length === 1 ? 'company' : 'companies'} serving {city.name} and the surrounding Dallas–Fort Worth area. Compare local pros below, see what they offer, and reach out for a free quote.
        </p>
      </section>

      {/* Listings */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <p className="text-sm text-gray-500 mb-5">{listings.length} companies found in {city.name}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
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
