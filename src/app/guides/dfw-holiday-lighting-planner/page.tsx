import type { Metadata } from 'next'
import { SOCIAL_IMAGE } from '@/lib/seo'
import Link from 'next/link'
import HolidayPlannerChecklist from '@/components/HolidayPlannerChecklist'
import { getGuideBySlug } from '@/lib/guides'

const guide = getGuideBySlug('dfw-holiday-lighting-planner')!
const PAGE_URL = 'https://www.dallaslights.com/guides/dfw-holiday-lighting-planner'
const REVIEWED_DATE = 'August 21, 2026'

export const metadata: Metadata = {
  title: '2026 DFW Holiday Lighting Planner & Checklist',
  description: guide.description,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    url: PAGE_URL,
    images: [SOCIAL_IMAGE],
    title: guide.title,
    description: guide.description,
    type: 'article',
  },
}

const TIMELINE = [
  {
    month: 'August–September',
    title: 'Plan the display and request quotes',
    body: 'Choose the areas you want lit, take a few reference photos, and contact installers. Earlier outreach gives you more flexibility on design and installation dates.',
  },
  {
    month: 'October',
    title: 'Finalize the design and schedule',
    body: 'Confirm colors, rooflines, trees, wreaths, power access, timers, maintenance, takedown, storage, and the full seasonal price in writing.',
  },
  {
    month: 'November',
    title: 'Install and test before your target date',
    body: 'Leave room for weather delays and a nighttime adjustment. Test the complete display and make sure you know how to operate its timer or app.',
  },
  {
    month: 'December–January',
    title: 'Maintain, photograph, and take down',
    body: 'Report outages promptly, keep connections protected, and confirm the removal window. Save a photo so next year’s design conversation is faster.',
  },
]

const FAQS = [
  {
    q: 'When should I book a Christmas light installer in Dallas–Fort Worth?',
    a: 'Late summer through early fall is the safest planning window if you want a preferred date before Thanksgiving. Some installers may still have openings later, but choices usually narrow as the season approaches.',
  },
  {
    q: 'What should a holiday lighting quote include?',
    a: 'Ask for the design scope, lighting and equipment, installation, timer or controls, in-season service, takedown, storage, taxes, and any renewal terms. Compare quotes that cover the same work.',
  },
  {
    q: 'Should I choose temporary or permanent holiday lights?',
    a: 'Temporary seasonal lighting usually costs less up front and can be redesigned each year. Permanent systems cost more initially but can provide year-round accent lighting and avoid annual installation and removal. The better choice depends on your budget and how often you expect to use the lights.',
  },
  {
    q: 'Does DallasLights.com install holiday lights?',
    a: 'No. DallasLights.com is a local directory that helps homeowners compare independent lighting companies. Services, availability, insurance, warranties, and pricing should be confirmed directly with the company you hire.',
  },
]

export default function HolidayLightingPlannerPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    datePublished: '2026-08-21',
    dateModified: '2026-08-21',
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
      { '@type': 'ListItem', position: 3, name: 'DFW Holiday Lighting Planner', item: PAGE_URL },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="max-w-4xl mx-auto px-4 pt-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-800">Holiday Lighting Planner</span>
      </div>

      <article className="max-w-4xl mx-auto px-4 py-8 md:py-10">
        <p className="text-sm font-semibold text-brand-700 mb-3">2026 DFW homeowner resource</p>
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
          DFW Holiday Lighting Planner &amp; Checklist
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mb-3">
          Plan your display before the seasonal rush. This free Dallas–Fort Worth checklist covers when to request quotes, what to compare, how to prepare for installation, and what to confirm before hiring.
        </p>
        <p className="text-sm text-gray-500 mb-7">Reviewed {REVIEWED_DATE}</p>

        <div className="flex flex-col sm:flex-row gap-3 mb-12">
          <Link
            href="/get-quotes?service=holiday"
            className="text-center bg-brand-500 hover:bg-brand-600 text-white font-bold px-6 py-3 rounded-lg transition-colors"
          >
            Request Holiday Lighting Quotes
          </Link>
          <Link
            href="/holiday"
            className="text-center bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Browse DFW Installers
          </Link>
        </div>

        <HolidayPlannerChecklist />

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">A practical DFW planning timeline</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {TIMELINE.map((item) => (
              <div key={item.month} className="bg-white border border-gray-200 rounded-xl p-5">
                <p className="text-sm font-bold text-brand-700 mb-1">{item.month}</p>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            This is a planning recommendation, not a promise of availability. Each company sets its own booking calendar.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Compare quotes on the same scope</h2>
          <p className="text-gray-700 leading-relaxed mb-5">
            A lower number is not necessarily a better deal if it leaves out service or takedown. Ask every installer the same questions and keep the answers with the written proposal.
          </p>
          <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-900">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Confirm</th>
                  <th scope="col" className="px-4 py-3 font-semibold">What to ask</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {[
                  ['Display scope', 'Exactly which rooflines, peaks, trees, shrubs, wreaths, and walkways are included?'],
                  ['Equipment', 'Are lights leased or purchased, and who owns them after the season?'],
                  ['Service', 'Who repairs outages or weather damage, and how quickly?'],
                  ['Schedule', 'What are the installation and takedown windows?'],
                  ['Protection', 'Is the company insured for the work being performed?'],
                  ['Next season', 'What is expected to change in price if I repeat the same display?'],
                ].map(([label, question]) => (
                  <tr key={label}>
                    <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{label}</th>
                    <td className="px-4 py-3">{question}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link href="/guides/christmas-light-installation-cost-dallas" className="inline-block mt-4 text-sm text-brand-700 font-semibold hover:text-brand-800">
            Read the DFW holiday lighting cost guide →
          </Link>
        </section>

        <section className="mb-12 bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Basic outdoor-lighting safety</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 leading-relaxed mb-4">
            <li>Use lights and extension cords labeled for outdoor use.</li>
            <li>Discard damaged strands with cracked sockets, frayed wires, or loose connections.</li>
            <li>Use ground-fault circuit interrupter (GFCI) protection for outdoor connections.</li>
            <li>Place ladders on level, firm ground and use the correct ladder for the job.</li>
            <li>Follow the manufacturer&apos;s limits for how many light strands can be connected.</li>
          </ul>
          <p className="text-xs text-gray-600">
            Sources: the{' '}
            <a href="https://www.cpsc.gov/Newsroom/News-Releases/2018/Put-Safety-at-the-Top-of-Your-List-When-Decorating-this-Holiday-Season" className="underline hover:text-gray-900" target="_blank" rel="noopener noreferrer">
              U.S. Consumer Product Safety Commission
            </a>{' '}
            and the{' '}
            <a href="https://content.nfpa.org/-/media/project/storefront/catalog/files/safety-tip-sheets/winterholidaysafetytips.pdf" className="underline hover:text-gray-900" target="_blank" rel="noopener noreferrer">
              National Fire Protection Association
            </a>.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Holiday lighting planning FAQ</h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div key={faq.q} className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-1">{faq.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-brand-50 border border-brand-200 rounded-xl p-6 md:p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to plan your display?</h2>
          <p className="text-gray-600 mb-5 max-w-2xl mx-auto">
            Tell us your city and project basics. DallasLights.com will review the request and connect you with a relevant DFW holiday lighting company when there is a good fit.
          </p>
          <Link
            href="/get-quotes?service=holiday"
            className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-bold px-7 py-3 rounded-lg transition-colors"
          >
            Request Free Quotes
          </Link>
        </section>
      </article>
    </>
  )
}
