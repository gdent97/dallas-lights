import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import LeadForm from '@/components/LeadForm'
import PhotoGallery from '@/components/PhotoGallery'
import { getListingBySlug, LISTINGS } from '@/lib/listings'
import { getCategoryMeta } from '@/lib/categories'

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return LISTINGS.map((l) => ({ slug: l.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const listing = getListingBySlug(params.slug)
  if (!listing) return {}
  const title = `${listing.name} — ${listing.city}, TX Lighting Company`
  const description = `${listing.name} is a ${listing.city}, TX lighting company. ${listing.description}${listing.phone ? ` Call ${listing.phone} for a free quote.` : ''}`
  return {
    title,
    description,
    alternates: { canonical: `https://dallaslights.com/company/${listing.slug}` },
    openGraph: { title, description },
  }
}

export default function CompanyPage({ params }: Props) {
  const listing = getListingBySlug(params.slug)
  if (!listing) notFound()

  const primaryCat = getCategoryMeta(listing.category[0])

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: listing.name,
    description: listing.description,
    telephone: listing.phone,
    ...(listing.email && { email: listing.email }),
    ...(listing.website && { url: listing.website }),
    address: {
      '@type': 'PostalAddress',
      streetAddress: listing.address,
      addressLocality: listing.city,
      addressRegion: listing.state,
      postalCode: listing.zip,
      addressCountry: 'US',
    },
    areaServed: listing.areasServed.map((area) => ({ '@type': 'City', name: area })),
    ...(listing.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: listing.rating,
        reviewCount: listing.reviewCount,
        bestRating: 5,
      },
    }),
  }

  const stars = listing.rating ? Math.round(listing.rating) : 0

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
        {primaryCat && (
          <>
            <Link href={`/${primaryCat.slug}`} className="hover:text-gray-800">{primaryCat.title}</Link>
            <span className="mx-2">›</span>
          </>
        )}
        <span className="text-gray-800">{listing.name}</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  {listing.logo && (
                    <div className="relative w-20 h-20 mb-3 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                      <Image
                        src={listing.logo}
                        alt={`${listing.name} logo`}
                        fill
                        sizes="80px"
                        className="object-contain p-1.5"
                      />
                    </div>
                  )}
                  {listing.tier !== 'free' && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full mb-2 inline-block ${listing.tier === 'featured' ? 'bg-brand-400 text-brand-900' : 'bg-blue-100 text-blue-800'}`}>
                      {listing.tier === 'featured' ? '⭐ Featured' : 'Premium'}
                    </span>
                  )}
                  <h1 className="text-2xl font-extrabold text-gray-900">{listing.name}</h1>
                  <p className="text-gray-500 text-sm mt-1">
                    {listing.address ? `${listing.address}, ` : ''}{listing.city}, {listing.state}{listing.zip ? ` ${listing.zip}` : ''}
                  </p>
                </div>
                {listing.rating && (
                  <div className="text-right shrink-0">
                    <div className="text-brand-500 text-lg">
                      {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
                    </div>
                    <div className="text-xs text-gray-400">{listing.rating} · {listing.reviewCount} reviews</div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {listing.category.map((c) => {
                  const meta = getCategoryMeta(c)
                  return meta ? (
                    <Link key={c} href={`/${c}`} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors">
                      {meta.title}
                    </Link>
                  ) : null
                })}
              </div>

              <p className="text-gray-700 leading-relaxed">{listing.description}</p>

              {listing.longDescription && (
                <div className="mt-4 text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {listing.longDescription}
                </div>
              )}
            </div>

            {/* Photos (premium listings) */}
            {listing.photos && <PhotoGallery photos={listing.photos} name={listing.name} />}

            {/* Services */}
            {listing.services.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="font-bold text-gray-900 mb-4">Services Offered</h2>
                <div className="flex flex-wrap gap-2">
                  {listing.services.map((s) => (
                    <span key={s} className="bg-brand-50 text-brand-800 text-sm px-3 py-1 rounded-full border border-brand-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Areas served */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="font-bold text-gray-900 mb-4">Areas Served in DFW</h2>
              <div className="flex flex-wrap gap-2">
                {listing.areasServed.map((area) => (
                  <span key={area} className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* About / quick facts */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="font-bold text-gray-900 mb-4">About {listing.name}</h2>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <dt className="text-gray-500">Primary Location</dt>
                <dd className="font-semibold text-gray-900">{listing.city}, {listing.state}</dd>
                <dt className="text-gray-500">Service Area</dt>
                <dd className="font-semibold text-gray-900">Dallas–Fort Worth</dd>
                {listing.yearsInBusiness && (
                  <>
                    <dt className="text-gray-500">Years in Business</dt>
                    <dd className="font-semibold text-gray-900">{listing.yearsInBusiness} years</dd>
                  </>
                )}
                {listing.insured && (
                  <>
                    <dt className="text-gray-500">Licensed &amp; Insured</dt>
                    <dd className="font-semibold text-gray-900">Yes</dd>
                  </>
                )}
                {listing.licenseNumber && (
                  <>
                    <dt className="text-gray-500">License #</dt>
                    <dd className="font-semibold text-gray-900">{listing.licenseNumber}</dd>
                  </>
                )}
              </dl>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <LeadForm companyName={listing.name} companyId={listing.id} />

            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
              <h3 className="font-bold text-gray-900">Contact</h3>
              {listing.phone && (
                <a href={`tel:${listing.phone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-2 text-brand-700 font-semibold hover:text-brand-800">
                  <span>📞</span> {listing.phone}
                </a>
              )}
              {listing.email && (
                <a href={`mailto:${listing.email}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm">
                  <span>✉️</span> {listing.email}
                </a>
              )}
              {listing.website && (
                <a href={listing.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm">
                  <span>🌐</span> Visit Website
                </a>
              )}
            </div>

            {listing.tier === 'free' && (
              <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 text-sm">
                <p className="font-semibold text-brand-800 mb-1">Is this your business?</p>
                <p className="text-brand-700 mb-3">Upgrade to a Premium listing to add photos, services, and appear higher in search results.</p>
                <Link href="/submit?tier=premium" className="block text-center bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2 rounded-lg transition-colors text-sm">
                  Claim & Upgrade
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
