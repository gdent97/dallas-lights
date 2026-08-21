import type { Metadata } from 'next'
import Link from 'next/link'
import QuoteLandingForm from '@/components/QuoteLandingForm'
import { CATEGORIES } from '@/lib/categories'
import { getCityBySlug } from '@/lib/cities'

export const metadata: Metadata = {
  title: 'Get Free Lighting Quotes in Dallas–Fort Worth',
  description:
    'Tell us about your lighting project and get matched with a Dallas–Fort Worth lighting company. Free to request, with no obligation.',
  alternates: { canonical: 'https://www.dallaslights.com/get-quotes' },
}

interface Props {
  searchParams?: { service?: string; city?: string }
}

export default function GetQuotesPage({ searchParams }: Props) {
  const category = CATEGORIES.find((item) => item.slug === searchParams?.service)
  const city = searchParams?.city ? getCityBySlug(searchParams.city) : undefined
  const context = [category?.title, city?.name].filter(Boolean).join(' in ')
  const leadType = context || 'DFW lighting quote request'

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-brand-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 grid md:grid-cols-2 gap-10 items-start">
        <div className="md:pt-6">
          <p className="text-brand-300 font-semibold text-sm uppercase tracking-wider mb-3">
            Free quote request
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-5">
            Find the right lighting pro for your DFW project
          </h1>
          <p className="text-lg text-gray-300 mb-7 max-w-xl">
            Share the basics once. We&apos;ll review your request and connect you with a relevant
            Dallas–Fort Worth lighting company when there is a good fit.
          </p>
          <ul className="space-y-3 text-gray-200 mb-8">
            {[
              'Free to request, with no obligation',
              'For residential, commercial, landscape, smart-home, and holiday lighting',
              'Your details are shared only to respond to your quote request',
            ].map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <span className="text-brand-400 font-bold" aria-hidden="true">✓</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
          <Link href="/" className="text-sm text-gray-300 underline underline-offset-4 hover:text-white">
            Prefer to choose yourself? Browse the directory
          </Link>
        </div>

        <div className="text-gray-900">
          <QuoteLandingForm
            leadType={leadType}
            initialServiceCategory={category?.slug}
            initialCity={city?.name}
          />
        </div>
      </div>
    </div>
  )
}
