import type { Metadata } from 'next'
import Link from 'next/link'
import ListingSubmitForm from '@/components/ListingSubmitForm'
import { getListingBySlug } from '@/lib/listings'

export const metadata: Metadata = {
  title: 'Add Your Lighting Business to DallasLights.com',
  description: 'List your Dallas–Fort Worth lighting company for free. Get found by local homeowners searching for lighting services across DFW.',
  alternates: { canonical: 'https://www.dallaslights.com/submit' },
}

const TIERS = [
  {
    id: 'free',
    name: 'Free Listing',
    price: '$0',
    description: 'Get found on DallasLights.com',
    features: ['Business name, phone & website', 'Category and city placement', 'Services & areas served', 'Basic profile page'],
    cta: 'Get Listed Free',
    highlight: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$99/mo',
    description: 'Stand out from the competition',
    features: [
      'Everything in Free',
      'Priority placement in category',
      'Services list & areas served',
      'Logo & up to 6 photos',
      'Lead capture form',
      'Website & email link',
    ],
    cta: 'Start Premium',
    highlight: true,
  },
  {
    id: 'featured',
    name: 'Featured',
    price: '$199/mo',
    description: 'Maximum visibility across the site',
    features: [
      'Everything in Premium',
      'Homepage featured placement',
      'Top of all relevant categories',
      '⭐ Featured badge',
      'Featured article linking to your website',
      'Limited placement by category and service area',
    ],
    cta: 'Get Featured',
    highlight: false,
  },
]

interface Props {
  searchParams?: { tier?: string; claim?: string }
}

export default function SubmitPage({ searchParams }: Props) {
  const requestedTier = searchParams?.tier === 'premium' || searchParams?.tier === 'featured'
    ? searchParams.tier
    : 'free'
  const claimedListing = searchParams?.claim ? getListingBySlug(searchParams.claim) : undefined

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
          Add Your Dallas Lighting Business
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Get your lighting company in front of Dallas–Fort Worth homeowners searching for local installers.
          Start with a free listing — upgrade anytime.
        </p>
      </div>

      {/* Early partner offer */}
      <div className="max-w-3xl mx-auto mb-10 bg-brand-500 text-white rounded-xl px-6 py-4 text-center">
        <p className="font-bold">Early Partner Pricing</p>
        <p className="text-sm text-white/90 mt-1">
          Ask about introductory pricing while DallasLights.com is growing its first group of advertising partners.
        </p>
      </div>

      {/* Tier cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
        {TIERS.map((tier) => (
          <div
            key={tier.id}
            className={`rounded-xl border p-6 flex flex-col ${tier.highlight ? 'border-brand-400 bg-brand-50 shadow-md' : 'border-gray-200 bg-white'}`}
          >
            {tier.highlight && (
              <div className="text-xs font-bold text-brand-700 uppercase tracking-widest mb-2">Recommended</div>
            )}
            <h2 className="text-xl font-bold text-gray-900">{tier.name}</h2>
            <div className="text-3xl font-extrabold text-gray-900 mt-1 mb-1">{tier.price}</div>
            <p className="text-sm text-gray-500 mb-5">{tier.description}</p>
            <ul className="space-y-2 text-sm text-gray-700 flex-1 mb-6">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-brand-500 font-bold mt-0.5">✓</span> {f}
                </li>
              ))}
            </ul>
            <Link
              href={`/submit?tier=${tier.id}#listing-form`}
              className={`block text-center font-semibold py-2.5 rounded-lg transition-colors text-sm ${tier.highlight ? 'bg-brand-500 hover:bg-brand-600 text-white' : 'bg-gray-900 hover:bg-gray-800 text-white'}`}
            >
              {tier.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* Simple contact form for free listing */}
      <div id="listing-form" className="max-w-xl mx-auto bg-white border border-gray-200 rounded-xl p-6 sm:p-8 scroll-mt-36">
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          {claimedListing ? `Claim ${claimedListing.name}` : 'Submit Your Listing Request'}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {claimedListing
            ? 'We’ll verify that you represent this business before making changes.'
            : 'Choose a plan and send your business details. We’ll review them and follow up.'}
        </p>

        <ListingSubmitForm
          key={`${claimedListing?.id || 'new'}:${requestedTier}`}
          initialBusinessName={claimedListing?.name}
          initialCompanyId={claimedListing?.id}
          initialTier={requestedTier}
        />
      </div>
    </div>
  )
}
