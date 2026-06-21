import Link from 'next/link'
import Image from 'next/image'
import type { Listing } from '@/lib/types'

interface Props {
  listing: Listing
}

const TIER_BADGE: Record<string, string> = {
  featured: 'bg-brand-400 text-brand-900 font-bold',
  premium: 'bg-blue-100 text-blue-800 font-semibold',
  free: '',
}

export default function ListingCard({ listing }: Props) {
  const stars = listing.rating
    ? '★'.repeat(Math.round(listing.rating)) + '☆'.repeat(5 - Math.round(listing.rating))
    : null

  return (
    <article className={`bg-white rounded-xl border ${listing.tier === 'featured' ? 'border-brand-400 shadow-md' : 'border-gray-200'} p-5 hover:shadow-lg transition-shadow flex flex-col`}>
      {listing.tier !== 'free' && (
        <div className="mb-3">
          <span className={`text-xs px-2 py-0.5 rounded-full ${TIER_BADGE[listing.tier]}`}>
            {listing.tier === 'featured' ? '⭐ Featured' : 'Premium'}
          </span>
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {listing.logo && (
            <div className="relative w-11 h-11 shrink-0 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
              <Image
                src={listing.logo}
                alt={`${listing.name} logo`}
                fill
                sizes="44px"
                className="object-contain p-0.5"
              />
            </div>
          )}
          <div className="min-w-0">
            <Link href={`/company/${listing.slug}`}>
              <h2 className="text-lg font-bold text-gray-900 hover:text-brand-600 transition-colors">
                {listing.name}
              </h2>
            </Link>
            <p className="text-sm text-gray-500 mt-0.5">
              {listing.city}, {listing.state}{listing.zip ? ` ${listing.zip}` : ''}
            </p>
          </div>
        </div>
        {stars && (
          <div className="text-right shrink-0">
            <div className="text-brand-500 text-sm">{stars}</div>
            {listing.reviewCount && <div className="text-xs text-gray-400">{listing.reviewCount} reviews</div>}
          </div>
        )}
      </div>

      <p className="text-sm text-gray-600 mt-3 line-clamp-2">{listing.description}</p>

      {listing.services.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {listing.services.slice(0, 4).map((s) => (
            <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 pt-3 flex items-center justify-between gap-2">
        {listing.phone ? (
          <a
            href={`tel:${listing.phone.replace(/[^0-9+]/g, '')}`}
            className="text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            {listing.phone}
          </a>
        ) : (
          <span className="text-sm text-gray-400">See website</span>
        )}
        <Link
          href={`/company/${listing.slug}`}
          className="text-sm text-gray-500 hover:text-gray-900 font-medium whitespace-nowrap"
        >
          View Profile →
        </Link>
      </div>
    </article>
  )
}
