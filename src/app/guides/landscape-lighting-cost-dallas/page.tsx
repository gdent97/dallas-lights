import type { Metadata } from 'next'
import Link from 'next/link'
import { getGuideBySlug } from '@/lib/guides'

const guide = getGuideBySlug('landscape-lighting-cost-dallas')!
const PAGE_URL = 'https://www.dallaslights.com/guides/landscape-lighting-cost-dallas'

export const metadata: Metadata = {
  title: `${guide.title} (2026)`,
  description: guide.description,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: guide.title, description: guide.description, type: 'article' },
}

const FAQS = [
  {
    q: 'How much does professional landscape lighting cost in Dallas?',
    a: 'Professionally installed low-voltage LED landscape lighting is usually priced per fixture, and across the industry installed pricing commonly runs from roughly $150 to $400+ per fixture depending on fixture quality, wiring runs, and site conditions. A typical front-yard system of 8–12 fixtures often lands in the low thousands, while full-property designs for larger homes can run considerably more. Get itemized quotes from two or three companies to compare.',
  },
  {
    q: 'Why do quotes vary so much between companies?',
    a: 'The biggest drivers are fixture quality (cast brass fixtures cost more up front but last far longer than aluminum in North Texas heat and sprinkler spray), transformer sizing, wiring method, and design time. A low quote often means fewer or lower-grade fixtures — ask each company to itemize fixtures, transformer, wiring, and labor so you can compare like for like.',
  },
  {
    q: 'Is landscape lighting worth it in DFW?',
    a: 'Landscape lighting is one of the more popular exterior upgrades in Dallas–Fort Worth because homes here are lived in outdoors much of the year. It adds evening curb appeal, extends the use of patios and pools after dark, and improves visibility and security around entries and walkways.',
  },
  {
    q: 'How much does landscape lighting cost to run and maintain?',
    a: 'Modern low-voltage LED systems draw very little power — running costs are typically a few dollars a month. Plan for occasional maintenance: trimming plants away from fixtures, re-aiming after landscaping changes, and replacing the odd damaged fixture. Many DFW companies offer annual maintenance plans.',
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
      { '@type': 'ListItem', position: 3, name: 'Landscape Lighting Cost', item: PAGE_URL },
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
        <span className="text-gray-800">Landscape Lighting Cost</span>
      </div>

      <article className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          Landscape Lighting Cost in Dallas: A Homeowner&apos;s Guide
        </h1>
        <p className="text-gray-600 leading-relaxed mb-8">
          Professional landscape lighting transforms how a home looks after dark — and in DFW, where
          patios and pools get used most of the year, it&apos;s one of the most requested outdoor
          upgrades. Here&apos;s how pricing typically works, what drives the cost up or down, and how to
          choose an installer.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How landscape lighting is priced</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Most professional outdoor lighting companies price <strong>per fixture, installed</strong> —
            fixtures, wiring, transformer, and labor bundled together. Industry-wide, installed
            pricing for quality low-voltage LED systems commonly runs roughly{' '}
            <strong>$150–$400+ per fixture</strong>, with premium cast-brass fixtures at the top of
            that range.
          </p>
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3 text-sm text-gray-700">
            <p><strong className="text-gray-900">Front yard accent package (8–12 fixtures):</strong> typically low thousands — path lights, uplights on trees and the facade.</p>
            <p><strong className="text-gray-900">Full property (25+ fixtures):</strong> front and back, outdoor living areas, pool and mature trees — often several thousand to five figures for estate-scale designs.</p>
            <p><strong className="text-gray-900">Additions to an existing system:</strong> usually straightforward per-fixture pricing if the transformer has capacity.</p>
            <p className="text-gray-500">Treat these as ballparks — design, terrain, and fixture selection move the number. Itemized quotes make comparison easy.</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What drives the price</h2>
          <ul className="space-y-2 text-gray-700 leading-relaxed list-disc pl-5">
            <li><strong>Fixture material.</strong> Cast brass costs more than aluminum but survives North Texas sun, sprinkler spray, and lawn crews for decades. Most premium installers use brass exclusively.</li>
            <li><strong>Number and type of fixtures.</strong> Uplights, path lights, downlights ("moonlighting" from trees), well lights, and underwater pool fixtures each price differently.</li>
            <li><strong>Wiring and site conditions.</strong> Long runs, crossing hardscape, and mature landscaping add labor.</li>
            <li><strong>Controls.</strong> Simple timers are inexpensive; app-controlled and zoned smart systems add cost but let you dim and schedule scenes.</li>
            <li><strong>Design.</strong> Good designers layer light and eliminate glare — it&apos;s the difference between a runway of dots and a home that looks stunning at night.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How to choose an installer</h2>
          <ul className="space-y-2 text-gray-700 leading-relaxed list-disc pl-5">
            <li>Ask to see a <strong>portfolio of night photos</strong> from real local projects — and ideally drive by one lit at night.</li>
            <li>Ask for a <strong>nighttime demo</strong> — many DFW companies will stage fixtures in your yard so you see the design before committing.</li>
            <li>Get the quote <strong>itemized</strong>: fixture count and brand, transformer, controls, warranty.</li>
            <li>Ask about the <strong>warranty</strong> on fixtures, LEDs, and workmanship — quality brass systems commonly carry long warranties.</li>
            <li>Confirm who handles <strong>maintenance</strong> — re-aiming, trimming, and repairs after installation.</li>
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
          <h2 className="text-xl font-bold text-gray-900 mb-2">Compare DFW landscape lighting pros</h2>
          <p className="text-gray-600 text-sm mb-4">
            Browse outdoor and landscape lighting companies serving your city, see their work, and
            request quotes directly.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/outdoor" className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
              All DFW Landscape Lighting Companies
            </Link>
            <Link href="/outdoor/dallas" className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
              Companies in Dallas
            </Link>
            <Link href="/outdoor/fort-worth" className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
              Companies in Fort Worth
            </Link>
          </div>
        </section>
      </article>
    </>
  )
}
