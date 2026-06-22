import type { Metadata } from 'next'
import Link from 'next/link'
import { GUIDES } from '@/lib/guides'

export const metadata: Metadata = {
  title: 'DFW Lighting Guides & Resources',
  description: 'Local guides to lighting in Dallas–Fort Worth — where to see Christmas lights, what installation costs, and how to pick the right company.',
  alternates: { canonical: 'https://dallaslights.com/guides' },
}

export default function GuidesIndex() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Guides &amp; Resources</h1>
      <p className="text-gray-600 mb-8">Local guides to lighting across Dallas–Fort Worth.</p>

      <div className="space-y-4">
        {GUIDES.map((g) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <h2 className="text-lg font-bold text-gray-900">{g.title}</h2>
            <p className="text-sm text-gray-600 mt-1">{g.excerpt}</p>
            <span className="text-sm text-brand-700 font-medium mt-2 inline-block">Read guide →</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
