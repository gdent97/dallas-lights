import type { Listing, Category } from './types'

/**
 * REAL Dallas–Fort Worth lighting companies.
 *
 * Data was gathered in June 2026 from each company's own public website.
 * Only verified facts are included — phone numbers and service areas come
 * straight from the source site. We intentionally do NOT include star
 * ratings, review counts, license numbers, or "years in business" because
 * those were not verifiable and must never be fabricated on a live site.
 *
 * ⚠️ BEFORE PUBLISHING: phone numbers and addresses change. Re-confirm each
 * company's details (a quick call or website check) before going live, and
 * remove any company that asks not to be listed.
 *
 * All entries are tier 'free' — these companies have not paid for placement.
 * When a company purchases Premium/Featured, change its `tier` and add the
 * extra fields (logo, photos, etc.).
 *
 * ───────────────────────────────────────────────────────────────────────────
 * HOW TO ADD A LOGO OR PHOTOS TO A LISTING (e.g. a new Premium client)
 * ───────────────────────────────────────────────────────────────────────────
 * 1. On GitHub, open the `public` folder → "Add file" → "Upload files" and
 *    drag the company's images in. Put them in a folder named after the
 *    company's slug, e.g.:
 *        public/companies/christmas-lights-4-u/logo.png
 *        public/companies/christmas-lights-4-u/1.jpg
 *        public/companies/christmas-lights-4-u/2.jpg
 *    (Resize large phone photos to ~2000px wide first so pages load fast.)
 *
 * 2. In this file, find that company below and add these lines inside its
 *    block (note the leading slash — the path starts from /public):
 *        tier: 'premium',
 *        logo: '/companies/christmas-lights-4-u/logo.png',
 *        photos: [
 *          '/companies/christmas-lights-4-u/1.jpg',
 *          '/companies/christmas-lights-4-u/2.jpg',
 *        ],
 *
 * 3. Commit changes. The site rebuilds automatically — the logo, photo
 *    gallery, and Premium badge appear, and the listing rises to the top
 *    of its category. Only edit text INSIDE the quotes; keep the commas.
 * ───────────────────────────────────────────────────────────────────────────
 */
export const LISTINGS: Listing[] = [
  {
    id: '1',
    slug: 'creative-nightscapes',
    name: 'Creative Nightscapes',
    tier: 'free',
    category: ['outdoor', 'residential', 'commercial'],
    phone: '(817) 581-6936',
    website: 'https://creativenightscapes.com/',
    address: '5755 Carlisle Ct #300',
    city: 'North Richland Hills',
    state: 'TX',
    zip: '76180',
    description: 'Landscape and outdoor lighting design and installation serving the greater Dallas–Fort Worth area.',
    services: ['Landscape Lighting', 'LED Lighting', 'Path Lighting', 'Driveway Lighting', 'Pool Deck Lighting', 'Security Lighting', 'Commercial Lighting', 'Maintenance'],
    areasServed: ['Dallas', 'Fort Worth', 'North Richland Hills', 'DFW Metroplex'],
    featured: false,
  },
  {
    id: '2',
    slug: 'dfw-lights',
    name: 'DFW Lights',
    tier: 'free',
    category: ['holiday', 'commercial'],
    phone: '(469) 702-1037',
    website: 'https://dfwlights.com/',
    address: '546 Silicon Dr, Suite 103',
    city: 'Southlake',
    state: 'TX',
    zip: '76092',
    description: 'Holiday light installation for homes and businesses, serving within a 50-mile radius of DFW Airport.',
    services: ['Residential Holiday Lighting', 'Commercial Holiday Lighting', 'Animated Light Shows', 'Garland & Wreaths', 'Reindeer Displays', 'Commercial Christmas Trees'],
    areasServed: ['Southlake', 'Keller', 'Frisco', 'Plano', 'Fort Worth', 'Highland Park'],
    featured: false,
  },
  {
    id: '3',
    slug: 'jack-frost-lights',
    name: 'Jack Frost Lights',
    tier: 'free',
    category: ['holiday', 'outdoor', 'residential'],
    phone: '(972) 712-5293',
    website: 'https://www.jackfrostlights.com/',
    address: 'PO Box 1095',
    city: 'Frisco',
    state: 'TX',
    zip: '75034',
    description: 'Residential and commercial holiday lighting plus permanent year-round lighting, using Everlights products.',
    services: ['Seasonal Christmas Lighting', 'Permanent Lighting', 'Commercial Lighting', 'Roofline Customization', 'Installation, Removal & Storage'],
    areasServed: ['Frisco', 'Little Elm', 'Plano', 'The Colony', 'McKinney', 'Denton', 'Allen'],
    featured: false,
  },
  {
    id: '4',
    slug: 'frostys-holiday-lighting',
    name: "Frosty's Holiday Lighting",
    tier: 'free',
    category: ['holiday', 'outdoor'],
    phone: '(972) 267-3719',
    website: 'https://www.frostysholidaylightingllc.com/',
    address: '11410 Mathis Ave',
    city: 'Farmers Branch',
    state: 'TX',
    zip: '75234',
    description: 'Full-service Christmas light design, installation, maintenance, and removal for HOAs and high-end homes.',
    services: ['Roofline Lighting', 'Wreaths & Garland', 'Interior Tree Decoration', 'Commercial LED Leasing', 'Event & Wedding Lighting', 'Patio & Landscape Lighting', 'Removal & Storage'],
    areasServed: ['Dallas', 'Fort Worth', 'Arlington', 'Irving', 'Las Colinas', 'Highland Park', 'University Park', 'Plano', 'Farmers Branch'],
    featured: false,
  },
  {
    id: '5',
    slug: 'nightsculptures',
    name: 'NightSculptures Outdoor Lighting',
    tier: 'featured',
    category: ['outdoor', 'residential'],
    phone: '(682) 217-4612',
    email: 'nightsculptures@gmail.com',
    website: 'https://www.nightsculptures.com/',
    logo: '/companies/nightsculptures/logo.png',
    logoBg: 'dark',
    city: 'Fort Worth',
    state: 'TX',
    description: 'Custom landscape, architectural, and outdoor lighting design across Dallas–Fort Worth.',
    longDescription: `NightSculptures designs and installs custom outdoor lighting that turns Dallas–Fort Worth homes into showpieces after dark. From warm architectural up-lighting on stone and stucco facades to dramatic tree lighting, pathway and hardscape lighting, poolside and pergola lighting, and full color-changing (RGB) permanent systems, every installation is designed around the property.

Serving Fort Worth, Dallas, and communities across the metroplex, the team focuses on clean, professional craftsmanship and ongoing maintenance so your lighting looks its best season after season.`,
    services: ['Landscape Lighting', 'Architectural & Facade Lighting', 'Home Exterior Lighting', 'Tree & Up-Lighting', 'Path & Walkway Lighting', 'Hardscape & Wall Lighting', 'Poolside Lighting', 'Pergola Lighting', 'Color-Changing (RGB) Lighting', 'Specialty & Feature Lighting', 'Maintenance'],
    areasServed: ['Fort Worth', 'Southlake', 'Colleyville', 'Keller', 'Flower Mound', 'Grapevine', 'Coppell', 'Arlington', 'Frisco', 'McKinney'],
    photos: [
      '/companies/nightsculptures/1.jpg',
      '/companies/nightsculptures/2.jpg',
      '/companies/nightsculptures/3.jpg',
      '/companies/nightsculptures/4.jpg',
      '/companies/nightsculptures/5.jpg',
      '/companies/nightsculptures/6.jpg',
      '/companies/nightsculptures/7.jpg',
      '/companies/nightsculptures/8.jpg',
    ],
    article: {
      title: 'Fort Worth Landscape Lighting: 3 Creative Outdoor Ideas',
      url: 'https://www.nightsculptures.com/post/3-creative-ways-to-illuminate-and-make-your-outdoor-spaces-stand-out-this-fall',
      excerpt: "NightSculptures shares three ways to elevate a Fort Worth yard after dark — up-lighting ornamental and native trees, highlighting your home's architecture, and lighting poolside and patio areas for entertaining.",
    },
    featured: true,
  },
  {
    id: '6',
    slug: 'christmas-lights-4-u',
    name: 'Christmas Lights 4 U',
    tier: 'free',
    category: ['holiday', 'residential', 'commercial'],
    phone: '(214) 907-1100',
    website: 'https://lights4myhouse.com/',
    city: 'Lewisville',
    state: 'TX',
    description: 'Custom residential and commercial Christmas light installation using commercial-grade LED strands cut to fit each home.',
    services: ['Custom Christmas Lighting', 'Residential Installation', 'Commercial Installation', 'Tree & Bush Lighting', 'Wreaths & Garland', 'Removal & Storage', 'In-Season Maintenance'],
    areasServed: ['Dallas', 'Highland Park', 'University Park', 'Southlake', 'Westlake', 'Colleyville', 'Grapevine', 'Coppell', 'Carrollton', 'Frisco', 'Plano', 'McKinney'],
    featured: false,
  },
  {
    id: '7',
    slug: 'christmas-lights-experts-dfw',
    name: 'Christmas Lights Experts DFW',
    tier: 'free',
    category: ['holiday', 'commercial', 'residential'],
    phone: '(469) 970-2715',
    website: 'https://www.christmaslightsexpertsdfw.com/',
    city: 'Plano',
    state: 'TX',
    description: 'Plano-based installer of residential, HOA, and commercial Christmas lighting across the DFW metroplex.',
    services: ['Residential Christmas Lighting', 'HOA & Community Lighting', 'Commercial Lighting', 'Tree Wrapping', 'Garland & Wreaths', 'Takedown & Storage', 'In-Season Maintenance'],
    areasServed: ['Plano', 'Frisco', 'McKinney', 'Allen', 'Dallas', 'Highland Park', 'Richardson', 'Carrollton', 'Southlake', 'Prosper', 'Celina', 'Fort Worth'],
    featured: false,
  },
  {
    id: '8',
    slug: 'astoria-lighting-co',
    name: 'Astoria Lighting Co.',
    tier: 'free',
    category: ['outdoor', 'holiday', 'smart-home'],
    phone: '(972) 430-6214',
    website: 'https://astorialightingco.com/locations/dallas-fort-worth-tx/',
    address: '817 S Mill St, Suite A104',
    city: 'Lewisville',
    state: 'TX',
    zip: '75057',
    description: 'Permanent Christmas lights and low-voltage landscape lighting using energy-efficient LED systems.',
    services: ['Permanent Christmas Lights', 'Landscape Lighting', 'Soffit Lighting', 'Outdoor String Lights', 'Pergola Lighting', 'Security Lighting', 'Pathway Lighting', 'Pool & Deck Lighting'],
    areasServed: ['Dallas', 'Fort Worth', 'Lewisville', 'Frisco', 'Flower Mound'],
    featured: false,
  },
  {
    id: '9',
    slug: 'the-perfect-light',
    name: 'The Perfect Light',
    tier: 'free',
    category: ['holiday', 'commercial', 'outdoor', 'electricians'],
    phone: '(833) 979-6777',
    website: 'https://theperfectlight.com/',
    address: '2010 Valley View Ln, Suite 100',
    city: 'Farmers Branch',
    state: 'TX',
    zip: '75234',
    description: 'Christmas, landscape, permanent, and commercial lighting, plus a full residential electrical division.',
    services: ['Christmas Lighting', 'Permanent Holiday Lighting', 'Landscape Lighting', 'Commercial Lighting', 'Electrical Services', 'Panel Upgrades', 'EV Charger Installation'],
    areasServed: ['Fort Worth', 'Dallas', 'Arlington', 'Mansfield', 'Grapevine', 'Keller', 'North Richland Hills', 'Colleyville'],
    featured: false,
  },
  {
    id: '10',
    slug: 'trimlight-dfw',
    name: 'Trimlight DFW',
    tier: 'free',
    category: ['outdoor', 'holiday', 'smart-home'],
    phone: '(817) 592-5100',
    website: 'https://trimlightdfw.com/',
    city: 'Mansfield',
    state: 'TX',
    description: 'Permanent app-controlled LED lighting for holidays, accents, and security, installed behind the gutter line.',
    services: ['Permanent LED Lighting', 'Holiday Lighting', 'Accent Lighting', 'Soffit Lighting', 'Landscape Lighting', 'Security Lighting', 'Game Day Lighting', 'App Control'],
    areasServed: ['Mansfield', 'Dallas', 'Fort Worth', 'DFW Metroplex'],
    featured: false,
  },
  {
    id: '11',
    slug: 'landscape-lighting-and-design',
    name: 'Landscape Lighting & Design',
    tier: 'free',
    category: ['outdoor', 'residential'],
    phone: '(817) 937-0204',
    website: 'https://www.landscapelightinganddesign.com/',
    address: '7381 W Vickery Blvd',
    city: 'Fort Worth',
    state: 'TX',
    zip: '76116',
    description: 'Fort Worth landscape lighting design specialist focused on moonlighting, up-lighting, and pathway lighting.',
    services: ['Landscape Lighting Design', 'Moonlighting', 'Up-Lighting', 'Pathway Lighting'],
    areasServed: ['Fort Worth', 'DFW Metroplex'],
    featured: false,
  },
  {
    id: '12',
    slug: 'majestic-outdoor-lighting',
    name: 'Majestic Outdoor Lighting',
    tier: 'free',
    category: ['outdoor', 'holiday', 'commercial', 'residential'],
    phone: '(817) 345-3696',
    website: 'https://www.majesticoutdoorlighting.com/',
    address: '5500 Feed Mill Rd, Ste 540',
    city: 'Fort Worth',
    state: 'TX',
    zip: '76248',
    description: 'Landscape, architectural, and permanent holiday lighting serving 70+ communities across the DFW metroplex.',
    services: ['Landscape Lighting', 'LED Landscape Lighting', 'Holiday & Christmas Lighting', 'Permanent Holiday Lighting', 'Home Exterior Lighting', 'Pool & Water Feature Lighting', 'Security Lighting', 'Commercial Lighting', 'Maintenance'],
    areasServed: ['Fort Worth', 'Keller', 'Dallas', 'Arlington', 'Plano', 'Frisco', 'McKinney', 'Irving', 'Garland'],
    featured: false,
  },
  {
    id: '13',
    slug: 'the-christmas-light-company',
    name: 'The Christmas Light Company',
    tier: 'free',
    category: ['holiday', 'commercial'],
    phone: '(214) 515-9627',
    website: 'https://www.xmasco.com/',
    address: '8019 Military Pkwy',
    city: 'Dallas',
    state: 'TX',
    zip: '75227',
    description: 'Residential, commercial, community, government, and event holiday lighting, plus permanent year-round displays.',
    services: ['Residential Lighting', 'Commercial Lighting', 'Community & HOA Lighting', 'Government Displays', 'Event Lighting', 'Permanent Lighting', 'Interior & Exterior Design'],
    areasServed: ['Dallas', 'Fort Worth', 'DFW Metroplex'],
    featured: false,
  },
  {
    id: '14',
    slug: 'j-bell-services',
    name: 'J Bell Services',
    tier: 'free',
    category: ['holiday', 'outdoor'],
    phone: '(214) 960-5692',
    website: 'https://jbellservices.com/holiday-lighting/christmas-lighting/',
    address: '12900 Valley Branch Ln, Suite 408',
    city: 'Farmers Branch',
    state: 'TX',
    zip: '75234',
    description: 'Christmas, Halloween, and landscape lighting with design, installation, and removal across the DFW area.',
    services: ['Christmas Lighting', 'Halloween Lighting', 'Color-Changing Lights', 'Landscape Lighting', 'Tree Up-Lighting', 'Patio Lighting', 'Commercial Holiday Lighting'],
    areasServed: ['Dallas', 'Fort Worth', 'Farmers Branch', 'DFW Metroplex'],
    featured: false,
  },
  {
    id: '15',
    slug: 'classic-holiday-lighting',
    name: 'Classic Holiday Lighting',
    tier: 'free',
    category: ['holiday', 'commercial'],
    phone: '(214) 592-5055',
    website: 'https://www.classicholidaylighting.com/',
    address: 'PO Box 463',
    city: 'Prosper',
    state: 'TX',
    zip: '75078',
    description: 'Residential and commercial holiday and event lighting, including roofline, landscape, and tree lighting.',
    services: ['Holiday Lighting', 'Residential Lighting', 'Commercial Lighting', 'Event Lighting', 'HOA Lighting', 'Lighting Rentals', 'Maintenance & Removal'],
    areasServed: ['Prosper', 'Frisco', 'McKinney', 'Plano', 'Lewisville', 'Denton', 'Celina', 'Little Elm', 'The Colony', 'Allen'],
    featured: false,
  },
  {
    id: '16',
    slug: 'cano-electric',
    name: 'Cano Electric',
    tier: 'free',
    category: ['outdoor', 'electricians'],
    phone: '(817) 242-2826',
    website: 'https://www.canoelectric.com/lighting/landscape-lighting',
    address: '7400 Whitehall St',
    city: 'Richland Hills',
    state: 'TX',
    zip: '76118',
    description: 'Licensed electrical contractor offering landscape lighting design and installation across North Texas.',
    services: ['Landscape Lighting', 'Path & Area Lighting', 'Moonlighting', 'Spotlighting', 'Floodlighting', 'Electrical Installation', 'GFCI & Panel Work'],
    areasServed: ['Fort Worth', 'Dallas', 'Carrollton', 'Plano', 'Arlington', 'Southlake', 'Allen', 'Mansfield', 'Frisco', 'McKinney'],
    featured: false,
  },
  {
    id: '17',
    slug: 'echo-electrical-services',
    name: 'Echo Electrical Services',
    tier: 'free',
    category: ['outdoor', 'electricians', 'commercial'],
    phone: '(817) 766-5995',
    website: 'https://echoelectricalservices.com/fort-worth-lighting/outdoor-lighting/',
    address: '3610 W Pioneer Pkwy, Ste D',
    city: 'Pantego',
    state: 'TX',
    zip: '76013',
    description: 'Electrical contractor specializing in landscape, security, and exterior lighting for homes and businesses.',
    services: ['Landscape Lighting', 'Security Lighting', 'Commercial Exterior Lighting', 'Industrial Lighting', 'LED Upgrades', 'Parking Lot Lighting', 'Repairs & Maintenance'],
    areasServed: ['Arlington', 'Fort Worth', 'Mansfield', 'Grand Prairie', 'Irving', 'Southlake', 'Dallas', 'Keller', 'Colleyville', 'Grapevine', 'Flower Mound'],
    featured: false,
  },
  {
    id: '18',
    slug: 'green-earth-dfw',
    name: 'Green Earth DFW',
    tier: 'free',
    category: ['outdoor', 'residential'],
    phone: '(817) 231-0042',
    website: 'https://greenearthdfw.com/outdoor-living/lighting/',
    city: 'Haslet',
    state: 'TX',
    description: 'Low-voltage LED landscape lighting design and installation for homes in the Fort Worth and Dallas areas.',
    services: ['Landscape Lighting', 'Pathway Lighting', 'Accent Lighting', 'Tree Lighting', 'Deck & Rail Lighting', 'Pond & Water Feature Lighting', 'Custom Design'],
    areasServed: ['Haslet', 'Fort Worth', 'Dallas', 'DFW Metroplex'],
    featured: false,
  },
  {
    id: '19',
    slug: 'everlights-dallas',
    name: 'EverLights Dallas',
    tier: 'free',
    category: ['outdoor', 'smart-home', 'holiday'],
    phone: '(214) 571-7992',
    website: 'https://myeverlights.com/locations/dallas/',
    city: 'Dallas',
    state: 'TX',
    description: 'Permanent, app-controlled holiday and accent lighting with color-changing RGBW systems for homes and businesses.',
    services: ['Permanent Holiday Lights', 'Warm Soffit Lighting', 'Seasonal Lighting', 'RGBW Color-Changing Systems', 'App Control', 'Commercial Lighting'],
    areasServed: ['Dallas', 'Fort Worth', 'DFW Metroplex'],
    featured: false,
  },
  {
    id: '20',
    slug: 'dallas-christmas-light-installers',
    name: 'Dallas Christmas Light Installers',
    tier: 'free',
    category: ['holiday', 'residential'],
    phone: '(972) 755-9580',
    website: 'https://dallaschristmaslightinstallers.com/',
    address: '5931 Greenville Ave #5522',
    city: 'Dallas',
    state: 'TX',
    zip: '75206',
    description: 'Custom holiday lighting design and installation with LED color options, timers, and in-season maintenance.',
    services: ['Custom Holiday Lighting', 'LED Installation', 'Pre-Lit Wreaths & Garland', 'Automatic Timers', 'Removal', 'Maintenance & Repair'],
    areasServed: ['Dallas', 'DFW Metroplex'],
    featured: false,
  },
  {
    id: '21',
    slug: 'trimlight-north-texas',
    name: 'Trimlight North Texas',
    tier: 'free',
    category: ['outdoor', 'smart-home', 'holiday', 'commercial'],
    phone: '(877) 874-6679',
    website: 'https://trimlightnorthtexas.com/',
    address: '5937 Plum St, Suite V',
    city: 'Watauga',
    state: 'TX',
    zip: '76148',
    description: 'Original DFW provider of permanent trim lighting for security, holidays, and accent lighting year-round.',
    services: ['Permanent Trim Lighting', 'Holiday Lighting', 'Landscape Lighting', 'Security Lighting', 'Accent & Down Lighting', 'Game Day Lighting', 'Commercial Lighting'],
    areasServed: ['Watauga', 'Fort Worth', 'North Dallas', 'DFW Metroplex'],
    featured: false,
  },
  {
    id: '22',
    slug: 'premier-oaks-lighting',
    name: 'Premier Oaks Lighting',
    tier: 'free',
    category: ['outdoor', 'holiday', 'commercial'],
    // No public phone number listed on their site — contact via website
    website: 'https://www.premieroakslighting.com/',
    city: 'Fort Worth',
    state: 'TX',
    description: 'Full-service outdoor lighting and Christmas decorating company offering free outdoor lighting demos.',
    services: ['Landscape Lighting', 'Up-Lighting', 'Pathway Lighting', 'Patio Lighting', 'Residential Christmas Lighting', 'Commercial Christmas Lighting'],
    areasServed: ['Fort Worth', 'Grapevine', 'Keller', 'Southlake', 'Colleyville', 'Carrollton'],
    featured: false,
  },
  {
    id: '23',
    slug: 'landmark-design-co',
    name: 'Landmark Design Co.',
    tier: 'featured',
    category: ['outdoor', 'residential', 'holiday'],
    phone: '(469) 994-8559',
    website: 'https://landmarkdesignco.com/dallas-outdoor-lighting/',
    logo: '/companies/landmark-design-co/logo.png',
    logoBg: 'dark',
    city: 'Dallas',
    state: 'TX',
    description: "Luxury landscape lighting for Dallas–Fort Worth's finest homes.",
    longDescription: `Landmark Design Co. specializes in the design, installation, and maintenance of custom architectural and landscape lighting for luxury homes throughout Dallas–Fort Worth. Every lighting system is thoughtfully designed to enhance the property's architecture, mature trees, outdoor living spaces, pools, and landscape with elegant, warm illumination that is both timeless and refined.

For more than 15 years, we have partnered with discerning homeowners, custom home builders, landscape architects, and designers to create sophisticated nighttime environments using premium brass fixtures, expert installation, and proven lighting techniques that eliminate glare while highlighting each property's unique character.

From Preston Hollow and Highland Park to Westlake, Southlake, Frisco, Prosper, Lucas, Fairview and beyond, Landmark Design Co. is committed to delivering exceptional craftsmanship, lasting performance, and a level of service that reflects the quality of the homes we illuminate.`,
    services: ['Landscape Lighting', 'Architectural Lighting', 'Estate & Large Property Lighting', 'Custom Christmas Lighting', 'Lake House & Vacation Home Lighting', 'Tree Lighting', 'Pool & Outdoor Living Lighting', 'Premium Brass Fixtures', 'Maintenance & Optimization'],
    areasServed: ['Dallas', 'Preston Hollow', 'Highland Park', 'University Park', 'Westlake', 'Southlake', 'Frisco', 'Prosper', 'Plano', 'Lucas', 'Fairview'],
    yearsInBusiness: 15,
    photos: [
      '/companies/landmark-design-co/1.jpg',
      '/companies/landmark-design-co/2.jpg',
      '/companies/landmark-design-co/3.jpg',
      '/companies/landmark-design-co/4.jpg',
      '/companies/landmark-design-co/5.jpg',
      '/companies/landmark-design-co/6.jpg',
      '/companies/landmark-design-co/7.jpg',
      '/companies/landmark-design-co/8.jpg',
    ],
    featured: true,
  },
]

export function getListingBySlug(slug: string): Listing | undefined {
  return LISTINGS.find((l) => l.slug === slug)
}

const TIER_ORDER: Record<Listing['tier'], number> = { featured: 0, premium: 1, free: 2 }

export function getListingsByCategory(category: Category): Listing[] {
  return LISTINGS
    .filter((l) => l.category.includes(category))
    .sort((a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier])
}

export function getFeaturedListings(): Listing[] {
  return LISTINGS.filter((l) => l.featured || l.tier === 'featured')
}

export function getAllListings(): Listing[] {
  return [...LISTINGS].sort((a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier])
}

// Tokens in `areasServed` that mean "serves the whole metro" — these companies
// should appear on every city page.
const METRO_TOKENS = ['DFW Metroplex', 'Dallas–Fort Worth', 'Dallas-Fort Worth', 'DFW', 'North Dallas']

function servesCity(listing: Listing, cityName: string): boolean {
  return listing.areasServed.some(
    (area) => area === cityName || METRO_TOKENS.includes(area),
  )
}

/** Companies in a given category that serve a given city (by city name). */
export function listingsForCategoryCity(category: Category, cityName: string): Listing[] {
  return LISTINGS
    .filter((l) => l.category.includes(category) && servesCity(l, cityName))
    .sort((a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier])
}

// Minimum companies required to publish a city+category page (avoids thin pages).
export const MIN_CITY_PAGE_LISTINGS = 2

