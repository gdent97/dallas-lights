import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Advertise Your Lighting Company — Premium & Featured Listings',
  description:
    'Put your lighting company in front of Dallas–Fort Worth homeowners. Free listings, plus Premium and Featured placements with photos, top position, and direct quote requests.',
  alternates: { canonical: 'https://www.dallaslights.com/advertise' },
}

interface Tier {
  name: string
  price: string
  tagline: string
  highlight?: boolean
  cta: { label: string; href: string }
  features: string[]
}

const TIERS: Tier[] = [
  {
    name: 'Free Listing',
    price: '$0',
    tagline: 'Every real DFW lighting company belongs here.',
    cta: { label: 'Add Free Listing', href: '/submit' },
    features: [
      'Company profile page',
      'Listed in your category & city pages',
      'Services & areas served',
      'Link to your website',
    ],
  },
  {
    name: 'Premium',
    price: '$99/mo',
    tagline: 'Stand out and capture leads directly.',
    highlight: true,
    cta: { label: 'Get Premium', href: '/submit?tier=premium' },
    features: [
      'Everything in Free',
      'Top placement in your category & city pages',
      'Photo gallery of your work',
      'Your logo on your profile',
      'Quote request form — leads sent straight to your inbox',
      'Premium badge on every card',
    ],
  },
  {
    name: 'Featured',
    price: '$199/mo',
    tagline: 'Own your category across the site.',
    cta: { label: 'Get Featured', href: '/submit?tier=featured' },
    features: [
      'Everything in Premium',
      'Large spotlight on the homepage',
      'Spotlight above the list on category & city pages',
      '⭐ Featured badge',
      'Featured article linking to your website',
      'Limited spots per category',
    ],
  },
]

export default function AdvertisePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          Get Your Lighting Company in Front of DFW Homeowners
        </h1>
        <p className="text-gray-600 leading-relaxed">
          DallasLights.com is a growing directory dedicated to one thing: connecting Dallas–Fort
          Worth homeowners and businesses with local lighting professionals. When someone searches
          for landscape, holiday, or smart-home lighting in DFW, we want them to find you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-12">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`flex flex-col rounded-2xl border p-6 bg-white ${
              tier.highlight ? 'border-brand-400 ring-2 ring-brand-200 shadow-lg' : 'border-gray-200'
            }`}
          >
            {tier.highlight && (
              <span className="self-start text-xs font-bold uppercase tracking-wide bg-brand-100 text-brand-800 px-2 py-0.5 rounded-full mb-3">
                Most popular
              </span>
            )}
            <h2 className="text-xl font-bold text-gray-900">{tier.name}</h2>
            <div className="text-3xl font-extrabold text-gray-900 mt-1">{tier.price}</div>
            <p className="text-sm text-gray-500 mt-1 mb-4">{tier.tagline}</p>
            <ul className="space-y-2 text-sm text-gray-700 mb-6">
              {tier.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-brand-500 font-bold shrink-0">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href={tier.cta.href}
              className={`mt-auto block text-center font-semibold px-6 py-2.5 rounded-lg transition-colors ${
                tier.highlight
                  ? 'bg-brand-500 hover:bg-brand-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              {tier.cta.label}
            </Link>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Why list here?</h2>
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            <strong>Buyers, not browsers.</strong> People visit a Dallas lighting directory for one
            reason — they&apos;re looking for a lighting company. A placement here puts you in front of
            people already shopping for exactly what you sell.
          </p>
          <p>
            <strong>Honest, clearly-labeled placements.</strong> We don&apos;t sell fake reviews or
            inflated ratings. Premium and Featured partners get real prominence — top position,
            photos, spotlights — always clearly labeled, which keeps visitors&apos; trust (and makes
            your placement worth more).
          </p>
          <p>
            <strong>No contracts.</strong> Month to month. If it&apos;s not producing for you, cancel
            anytime.
          </p>
        </div>

        <div className="bg-brand-50 border border-brand-200 rounded-xl p-6 mt-10 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Questions before you commit?</h2>
          <p className="text-gray-600 text-sm mb-4">
            Send us a note and we&apos;ll walk you through what a Premium or Featured placement looks
            like for your company.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}
