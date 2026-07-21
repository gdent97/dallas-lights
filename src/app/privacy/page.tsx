import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for DallasLights.com — what information we collect, how it is used, and who to contact with questions.',
  alternates: { canonical: 'https://www.dallaslights.com/privacy' },
  robots: { index: true, follow: true },
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: July 21, 2026</p>

      <div className="space-y-6 text-gray-700 leading-relaxed text-[15px]">
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Who we are</h2>
          <p>
            DallasLights.com is a directory of lighting companies serving the Dallas–Fort Worth,
            Texas area. This policy describes what information we collect when you use the site and
            how we use it.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Information you submit</h2>
          <p>
            When you submit a form on this site — a quote request, a contact message, a business
            listing, or a newsletter signup — we collect the information you enter (such as your
            name, phone number, email address, and message). Quote requests are forwarded to us and
            to the company you asked to be connected with, so they can respond to your inquiry.
            Business listing submissions are used to create or update the company&apos;s public listing.
          </p>
          <p className="mt-2">
            We do not sell your personal information.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Analytics and cookies</h2>
          <p>
            We use Google Analytics to understand how visitors use the site (pages visited, general
            location, device type). Google Analytics uses cookies and collects data as described in{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-700 font-semibold hover:text-brand-800"
            >
              Google&apos;s privacy policy
            </a>
            . We may also run advertising campaigns (such as Google Ads) that use similar
            measurement cookies to understand which ads lead to visits and inquiries.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Third-party services</h2>
          <p>
            Form submissions are processed by Web3Forms, which relays them to our email. Listing
            pages may link to third-party websites (the listed companies&apos; own sites); their privacy
            practices are their own.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Your choices</h2>
          <p>
            You can ask us to correct or delete information you&apos;ve submitted — including removing a
            business listing — by reaching out via the{' '}
            <Link href="/contact" className="text-brand-700 font-semibold hover:text-brand-800">
              contact page
            </Link>
            . You can opt out of Google Analytics with{' '}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-700 font-semibold hover:text-brand-800"
            >
              Google&apos;s browser add-on
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Changes to this policy</h2>
          <p>
            If we make material changes to this policy, we&apos;ll update this page and the date above.
          </p>
        </section>
      </div>
    </div>
  )
}
