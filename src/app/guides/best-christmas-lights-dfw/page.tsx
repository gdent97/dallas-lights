import type { Metadata } from 'next'
import Link from 'next/link'
import { getGuideBySlug } from '@/lib/guides'

const guide = getGuideBySlug('best-christmas-lights-dfw')!

export const metadata: Metadata = {
  title: `${guide.title} (Local Guide)`,
  description: guide.description,
  alternates: { canonical: 'https://dallaslights.com/guides/best-christmas-lights-dfw' },
  openGraph: { title: guide.title, description: guide.description, type: 'article' },
}

interface Spot {
  name: string
  area: string
  blurb: string
}

const DALLAS_SPOTS: Spot[] = [
  { name: 'Highland Park', area: 'Dallas', blurb: 'Grand homes with over-the-top displays. A popular route starts near Armstrong Parkway and Preston Road.' },
  { name: 'Swiss Avenue', area: 'East Dallas', blurb: 'Historic mansions along a wide boulevard, mixing classic Christmas charm with creative modern displays.' },
  { name: 'Lakewood & Lake Highlands', area: 'East Dallas', blurb: 'Lakewood Boulevard and the Timberhollow Circle area are local favorites for an easy drive-through loop.' },
  { name: 'Kessler Park', area: 'Oak Cliff', blurb: 'Beautifully decorated homes with a cozy, neighborly holiday feel on the west side of Dallas.' },
  { name: 'Deerfield', area: 'Plano', blurb: 'One of the most-visited free neighborhood displays in the metroplex — enjoyable by car or on foot.' },
]

const FORT_WORTH_SPOTS: Spot[] = [
  { name: 'Interlochen', area: 'Arlington', blurb: 'A decades-long tradition where 200+ homes go all-out with lights and themed displays — the most famous lights neighborhood in the area.' },
  { name: 'Glenbrook', area: 'Bedford', blurb: 'A nearly four-decade tradition that lights up nightly; you can drive through the neighborhood for free.' },
  { name: 'Diamond Loch / NRH Grinch Lights', area: 'North Richland Hills', blurb: 'A massive computerized light show plus a fun, growing "Whoville"-style street experience.' },
  { name: 'Ridglea Hills', area: 'Fort Worth', blurb: 'Homes whose lights reflect across 10-acre Luther Lake — best viewed from the bridge along Clayton Road.' },
]

const ATTRACTIONS: Spot[] = [
  { name: 'Christmas in the Square', area: 'Frisco', blurb: 'One of the largest choreographed light shows in North Texas, with an outdoor ice rink nearby.' },
  { name: 'Elf Town (Loder Family)', area: 'Plano', blurb: 'A standout home display that has earned national attention for its scale and detail.' },
]

function SpotList({ title, spots }: { title: string; spots: Spot[] }) {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      <div className="space-y-4">
        {spots.map((s) => (
          <div key={s.name} className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-900">
              {s.name} <span className="font-normal text-gray-500 text-sm">— {s.area}</span>
            </h3>
            <p className="text-gray-600 text-sm mt-1">{s.blurb}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function GuidePage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    author: { '@type': 'Organization', name: 'DallasLights.com' },
    publisher: { '@type': 'Organization', name: 'DallasLights.com' },
    mainEntityOfPage: 'https://dallaslights.com/guides/best-christmas-lights-dfw',
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://dallaslights.com' },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://dallaslights.com/guides' },
      { '@type': 'ListItem', position: 3, name: 'Best Christmas Lights in DFW', item: 'https://dallaslights.com/guides/best-christmas-lights-dfw' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto px-4 pt-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-800">Best Christmas Lights in DFW</span>
      </div>

      <article className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          Best Places to See Christmas Lights in Dallas–Fort Worth
        </h1>
        <p className="text-gray-600 leading-relaxed mb-2">
          Every December, neighborhoods across DFW transform into glowing wonderlands. Whether you want a free drive-through display with the kids or a famous street worth the trip, here are the best spots to see Christmas lights across Dallas, Fort Worth, and the surrounding suburbs.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Hours, dates, and access can change each year — please check the neighborhood or attraction&apos;s official/local info before you head out, and always be respectful of residents.
        </p>

        <SpotList title="Dallas & Plano Neighborhoods" spots={DALLAS_SPOTS} />
        <SpotList title="Fort Worth, Arlington & Mid-Cities" spots={FORT_WORTH_SPOTS} />
        <SpotList title="Bigger Shows & Standout Displays" spots={ATTRACTIONS} />

        {/* CTA bridging viewers -> installers */}
        <section className="bg-brand-50 border border-brand-200 rounded-xl p-6 mt-4">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Want your home to look like these?</h2>
          <p className="text-gray-600 text-sm mb-4">
            The best displays are usually done by professional installers. Browse local DFW companies that install holiday lights — many also offer permanent, app-controlled lighting you leave up year-round.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/holiday" className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
              Find Holiday Light Installers
            </Link>
            <Link href="/holiday/dallas" className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
              Installers in Dallas
            </Link>
          </div>
        </section>
      </article>
    </>
  )
}
