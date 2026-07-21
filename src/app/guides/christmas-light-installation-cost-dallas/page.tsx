import type { Metadata } from 'next'
import Link from 'next/link'
import { getGuideBySlug } from '@/lib/guides'

const guide = getGuideBySlug('christmas-light-installation-cost-dallas')!
const PAGE_URL = 'https://www.dallaslights.com/guides/christmas-light-installation-cost-dallas'

export const metadata: Metadata = {
  title: `${guide.title} (2026 Guide)`,
  description: guide.description,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: guide.title, description: guide.description, type: 'article' },
}

const FAQS = [
  {
    q: 'How much does professional Christmas light installation cost in Dallas?',
    a: 'Most professional installers price by the linear foot of lighting, and across the industry that typically runs a few dollars per foot installed. For a typical single-story DFW home, quotes commonly land in the several-hundred-dollar range for a basic roofline; larger two-story homes with trees, ridgelines, and ground displays can run well over a thousand dollars. Prices vary by company and design, so get more than one quote.',
  },
  {
    q: 'Does the price include takedown and storage?',
    a: 'Usually, yes. Most DFW holiday lighting companies quote a full-service seasonal package: design, commercial-grade lights, installation, mid-season maintenance, takedown in January, and often storage. Always confirm exactly what a quote includes before comparing prices.',
  },
  {
    q: 'When should I book Christmas light installation in DFW?',
    a: 'Earlier than you think. Reputable installers begin booking in late summer and early fall, and calendars fill fast — installs often start in October and early November. Booking early usually means better scheduling choices, and some companies offer early-bird pricing.',
  },
  {
    q: 'What about permanent (year-round) holiday lighting?',
    a: 'Permanent app-controlled track lighting (soffit/eave systems) costs significantly more up front — typically several thousand dollars depending on the home — but eliminates annual install and takedown fees and doubles as accent and security lighting the rest of the year. Several DFW companies specialize in it.',
  },
]

export default function GuidePage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    author: { '@type': 'Organization', name: 'DallasLights.com' },
    publisher: { '@type': 'Organization', name: 'DallasLights.com' },
    mainEntityOfPage: PAGE_URL,
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.dallaslights.com' },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://www.dallaslights.com/guides' },
      { '@type': 'ListItem', position: 3, name: 'Christmas Light Installation Cost', item: PAGE_URL },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto px-4 pt-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-800">Christmas Light Installation Cost</span>
      </div>

      <article className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          How Much Does Christmas Light Installation Cost in Dallas?
        </h1>
        <p className="text-gray-600 leading-relaxed mb-8">
          Hiring a pro to hang your holiday lights buys you a designed display, commercial-grade
          lights, insured crews on the roof instead of you, and someone to take it all down in
          January. Here&apos;s how pricing typically works in Dallas–Fort Worth, what&apos;s included, and
          how to compare quotes.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How installers price a display</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Nearly every professional holiday lighting company prices by the <strong>linear foot</strong> of
            lighting installed — rooflines, ridgelines, gables — plus flat amounts for extras like
            wrapped trees, garlands, wreaths, and ground displays. Industry-wide, installed pricing
            typically works out to a few dollars per linear foot, and most quotes bundle the whole
            season into one price.
          </p>
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3 text-sm text-gray-700">
            <p><strong className="text-gray-900">Basic roofline, single-story home:</strong> commonly in the several-hundred-dollar range for the season.</p>
            <p><strong className="text-gray-900">Larger two-story home with peaks and ridgelines:</strong> often $1,000+ once you add height, complexity, and more footage.</p>
            <p><strong className="text-gray-900">Trees, garland, and custom displays:</strong> priced per element — wrapped trees in particular add up quickly.</p>
            <p className="text-gray-500">Every company prices differently. Treat these as ballparks and get two or three quotes for your specific home.</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What a full-service package includes</h2>
          <ul className="space-y-2 text-gray-700 leading-relaxed list-disc pl-5">
            <li><strong>Design</strong> — an installer walks the property and proposes a look.</li>
            <li><strong>Commercial-grade LED lights</strong> — usually leased, which is why displays look consistent and bright. Some companies also install lights you purchase.</li>
            <li><strong>Installation</strong> — insured crews with the right equipment for two-story rooflines.</li>
            <li><strong>Mid-season maintenance</strong> — burnt-out bulbs and storm damage fixed during the season.</li>
            <li><strong>Takedown and storage</strong> — removal in January, often storage until next year.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            When comparing quotes, make sure each one covers the same scope — a cheap quote that
            excludes takedown or maintenance isn&apos;t actually cheap.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">When to book in DFW</h2>
          <p className="text-gray-700 leading-relaxed">
            The best companies book up fast. Many begin scheduling in <strong>late summer</strong>, start
            installs in <strong>October</strong>, and are fully booked by mid-November. If you want a
            specific installer — or an install date before Thanksgiving — reach out in September or
            earlier. Booking early can also mean early-bird pricing with some companies.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions to ask before hiring</h2>
          <ul className="space-y-2 text-gray-700 leading-relaxed list-disc pl-5">
            <li>Is the quote all-inclusive (lights, install, maintenance, takedown, storage)?</li>
            <li>Are the lights leased or purchased — and what happens if a strand fails mid-season?</li>
            <li>Are you insured for work on my roof?</li>
            <li>When exactly will you install, and when do lights come down?</li>
            <li>What does the same display cost to re-install next year?</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">FAQ</h2>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <div key={f.q} className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-1">{f.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA into the directory */}
        <section className="bg-brand-50 border border-brand-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Ready to get quotes?</h2>
          <p className="text-gray-600 text-sm mb-4">
            Compare professional holiday lighting companies serving your part of the metroplex and
            request quotes directly.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/holiday" className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
              All DFW Holiday Light Installers
            </Link>
            <Link href="/holiday/dallas" className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
              Installers in Dallas
            </Link>
            <Link href="/holiday/fort-worth" className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
              Installers in Fort Worth
            </Link>
          </div>
        </section>
      </article>
    </>
  )
}
