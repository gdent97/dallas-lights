import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms of use for DallasLights.com — how the directory works, listing accuracy, and limitations.',
  alternates: { canonical: 'https://www.dallaslights.com/terms' },
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Terms of Use</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: July 21, 2026</p>

      <div className="space-y-6 text-gray-700 leading-relaxed text-[15px]">
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">What this site is</h2>
          <p>
            DallasLights.com is an independent online directory of lighting companies serving the
            Dallas–Fort Worth area. We list businesses and help visitors contact them. We do not
            perform lighting services, and we are not a party to any agreement between you and a
            listed company.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">No endorsement or guarantee</h2>
          <p>
            A listing on this site — including paid Premium or Featured placements, which are always
            labeled — is not an endorsement, recommendation, or guarantee of any company&apos;s work,
            licensing, insurance, or pricing. Listing information comes from the companies themselves
            or their public websites and may change or become outdated. Always verify credentials,
            insurance, and references directly with a company before hiring.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Business listings</h2>
          <p>
            By submitting a listing, you confirm the information is accurate and that you are
            authorized to represent the business. We may edit listings for clarity, decline or
            remove any listing at our discretion, and update listing details when a company&apos;s
            public information changes. To correct or remove a listing, use the{' '}
            <Link href="/contact" className="text-brand-700 font-semibold hover:text-brand-800">
              contact page
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Limitation of liability</h2>
          <p>
            The site is provided &quot;as is&quot; without warranties of any kind. To the fullest extent
            permitted by law, DallasLights.com is not liable for any damages arising from your use
            of the site or from any transaction or interaction with a listed company.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Questions</h2>
          <p>
            Questions about these terms? Reach out via the{' '}
            <Link href="/contact" className="text-brand-700 font-semibold hover:text-brand-800">
              contact page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
