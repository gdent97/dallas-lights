import type { Metadata } from 'next'
import Link from 'next/link'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Contact DallasLights.com — questions about a listing, corrections, advertising, or anything else about the Dallas–Fort Worth lighting directory.',
  alternates: { canonical: 'https://www.dallaslights.com/contact' },
}

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Contact Us</h1>
      <p className="text-gray-600 mb-8">
        Questions about a listing, a correction, advertising, or anything else — send us a message
        and we&apos;ll get back to you.
      </p>

      <ContactForm />

      <div className="mt-8 text-sm text-gray-500 space-y-2">
        <p>
          <strong className="text-gray-700">Own a lighting company?</strong> The fastest way to get
          listed is the{' '}
          <Link href="/submit" className="text-brand-700 font-semibold hover:text-brand-800">
            free listing form
          </Link>
          . For Premium and Featured placements, see{' '}
          <Link href="/advertise" className="text-brand-700 font-semibold hover:text-brand-800">
            advertising options
          </Link>
          .
        </p>
        <p>
          <strong className="text-gray-700">Looking for a quote?</strong> Browse companies by
          category from the <Link href="/" className="text-brand-700 font-semibold hover:text-brand-800">homepage</Link>{' '}
          and request a quote directly from any Premium profile.
        </p>
      </div>
    </div>
  )
}
