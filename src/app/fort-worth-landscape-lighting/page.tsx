import type { Metadata } from 'next'
import QuoteLandingForm from '@/components/QuoteLandingForm'

export const metadata: Metadata = {
  title: 'Fort Worth Landscape Lighting — Free Quotes from Local Pros',
  description: 'Get free quotes from trusted landscape lighting companies in Fort Worth, TX. Compare local pros and get your project started.',
  // This is a paid-ad landing page — keep it out of the search index so it
  // doesn't compete with the organic /outdoor/fort-worth page.
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://dallaslights.com/fort-worth-landscape-lighting' },
}

const BENEFITS = [
  'Local Fort Worth–area landscape lighting pros',
  'Free, no-obligation quotes',
  'Path lighting, up-lighting, pool & patio, and more',
  'One quick form — we connect you with the right company',
]

export default function FortWorthLandscapeLightingLanding() {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-brand-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-16 grid md:grid-cols-2 gap-10 items-center">
        {/* Left: pitch */}
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">
            Landscape Lighting in Fort Worth, TX
          </h1>
          <p className="text-lg text-gray-300 mb-6">
            Get free quotes from trusted local landscape lighting companies — and make your yard look incredible after dark.
          </p>
          <ul className="space-y-3">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span className="text-brand-400 font-bold mt-0.5">✓</span>
                <span className="text-gray-200">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: form */}
        <div className="text-gray-900">
          <QuoteLandingForm leadType="Fort Worth Landscape Lighting" />
        </div>
      </div>
    </div>
  )
}
