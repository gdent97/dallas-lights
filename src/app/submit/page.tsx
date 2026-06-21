import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Add Your Lighting Business to DallasLights.com',
  description: 'List your Dallas-area lighting company for free. Reach thousands of homeowners and businesses searching for lighting services in DFW.',
}

const TIERS = [
  {
    id: 'free',
    name: 'Free Listing',
    price: '$0',
    description: 'Get found on DallasLights.com',
    features: ['Business name & phone', 'Category listing', 'Basic profile page'],
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
      'Priority lead routing',
      'Monthly performance report',
    ],
    cta: 'Get Featured',
    highlight: false,
  },
]

export default function SubmitPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
          Add Your Dallas Lighting Business
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Reach thousands of Dallas homeowners and property managers actively searching for lighting services.
          Start with a free listing — upgrade anytime.
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
              <div className="text-xs font-bold text-brand-700 uppercase tracking-widest mb-2">Most Popular</div>
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
            <a
              href={`mailto:listings@dallaslights.com?subject=${encodeURIComponent(`${tier.name} listing inquiry`)}`}
              className={`block text-center font-semibold py-2.5 rounded-lg transition-colors text-sm ${tier.highlight ? 'bg-brand-500 hover:bg-brand-600 text-white' : 'bg-gray-900 hover:bg-gray-800 text-white'}`}
            >
              {tier.cta}
            </a>
          </div>
        ))}
      </div>

      {/* Simple contact form for free listing */}
      <div className="max-w-xl mx-auto bg-white border border-gray-200 rounded-xl p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Submit a Free Listing</h2>
        <p className="text-sm text-gray-500 mb-6">We'll review and publish your listing within 24 hours.</p>

        <form
          action="mailto:listings@dallaslights.com"
          method="GET"
          encType="text/plain"
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
            <input name="business_name" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <input name="phone" type="tel" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input name="website" type="url" placeholder="https://" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select name="category" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400">
              <option value="">Select a category…</option>
              <option>Residential Lighting</option>
              <option>Commercial Lighting</option>
              <option>Outdoor & Landscape Lighting</option>
              <option>Lighting Electricians</option>
              <option>Smart Home Lighting</option>
              <option>Holiday & Event Lighting</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
            <textarea name="description" rows={3} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
          </div>
          <button
            type="submit"
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
          >
            Submit Free Listing
          </button>
        </form>
      </div>
    </div>
  )
}
