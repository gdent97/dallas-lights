import type { Metadata } from 'next'
import Link from 'next/link'
import { CATEGORIES } from '@/lib/categories'
import { getAllListings } from '@/lib/listings'

export const metadata: Metadata = {
  title: 'About DallasLights.com',
  description:
    'DallasLights.com is a local directory of lighting companies serving Dallas–Fort Worth. Learn how listings work, how companies are added, and how to get in touch.',
  alternates: { canonical: 'https://www.dallaslights.com/about' },
}

export default function AboutPage() {
  const totalCount = getAllListings().length

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">About DallasLights.com</h1>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <p>
          DallasLights.com is a local directory of lighting companies serving the Dallas–Fort Worth
          metroplex. Our goal is simple: make it easy for DFW homeowners and businesses to find the
          right lighting professional — whether that&apos;s landscape lighting, holiday light installation,
          smart home lighting, or a licensed electrician.
        </p>

        <h2 className="text-xl font-bold text-gray-900 pt-2">How listings work</h2>
        <p>
          We currently list {totalCount} lighting companies across {CATEGORIES.length} categories.
          Every listing is a real Dallas–Fort Worth area business. Listing details — services, areas
          served, and contact information — come from each company&apos;s own website or are provided
          directly by the company. We don&apos;t publish fabricated reviews or ratings.
        </p>
        <p>
          Basic listings are free. Companies can upgrade to a <strong>Premium</strong> or{' '}
          <strong>Featured</strong> placement for a richer profile with photos and top placement on
          relevant pages. Paid placements are always clearly labeled with a Premium or ⭐ Featured
          badge, so you always know which companies are advertising partners.
        </p>

        <h2 className="text-xl font-bold text-gray-900 pt-2">What we are (and aren&apos;t)</h2>
        <p>
          We&apos;re an independent directory — we don&apos;t perform lighting work ourselves, and a listing
          on this site is not an endorsement or a guarantee of work quality. Always verify licensing,
          insurance, and references directly with any company before hiring.
        </p>

        <h2 className="text-xl font-bold text-gray-900 pt-2">Are we missing a company?</h2>
        <p>
          If you run a lighting business in DFW — or know a great one we haven&apos;t listed — you can{' '}
          <Link href="/submit" className="text-brand-700 font-semibold hover:text-brand-800">
            add a free listing here
          </Link>
          . Corrections or updates to an existing listing? Just{' '}
          <Link href="/contact" className="text-brand-700 font-semibold hover:text-brand-800">
            contact us
          </Link>{' '}
          and we&apos;ll fix it.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/submit"
          className="block text-center bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Add Your Business — Free
        </Link>
        <Link
          href="/contact"
          className="block text-center bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Contact Us
        </Link>
      </div>
    </div>
  )
}
