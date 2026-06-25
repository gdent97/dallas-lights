import Link from 'next/link'
import Image from 'next/image'
import type { Listing } from '@/lib/types'

/** Large, prominent homepage spotlight for the Featured partner. */
export default function FeaturedSpotlight({ listing }: { listing: Listing }) {
  const hero = listing.photos?.[0]

  return (
    <section className="max-w-6xl mx-auto px-4 pt-10">
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600">⭐ Featured Partner</span>
        <span className="text-xs text-gray-400">{listing.city}, {listing.state}</span>
      </div>

      <div className="grid md:grid-cols-2 rounded-2xl overflow-hidden border-2 border-brand-300 shadow-lg bg-white">
        {hero && (
          <div className="relative min-h-[240px] md:min-h-[380px]">
            <Image
              src={hero}
              alt={`${listing.name} landscape lighting project`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="p-6 md:p-8 flex flex-col justify-center">
          {listing.logo && (
            <div className={`relative w-32 h-16 mb-4 rounded-lg overflow-hidden border ${listing.logoBg === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-100'}`}>
              <Image
                src={listing.logo}
                alt={`${listing.name} logo`}
                fill
                sizes="128px"
                className="object-contain p-2"
              />
            </div>
          )}

          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">{listing.name}</h2>
          <p className="text-gray-600 mt-2 leading-relaxed">{listing.description}</p>

          {listing.services.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {listing.services.slice(0, 5).map((s) => (
                <span key={s} className="text-xs bg-brand-50 text-brand-800 border border-brand-200 px-2 py-0.5 rounded-full">
                  {s}
                </span>
              ))}
            </div>
          )}

          {listing.article && (
            <a
              href={listing.article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-sm font-medium text-brand-700 hover:text-brand-800"
            >
              📖 {listing.article.title} →
            </a>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/company/${listing.slug}`}
              className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
            >
              View Profile →
            </Link>
            {listing.phone && (
              <a
                href={`tel:${listing.phone.replace(/[^0-9+]/g, '')}`}
                className="border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
              >
                📞 {listing.phone}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
