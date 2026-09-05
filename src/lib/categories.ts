import type { CategoryMeta } from './types'

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: 'residential',
    title: 'Residential Lighting',
    heading: 'Residential Lighting Companies in Dallas–Fort Worth',
    description: 'Compare residential lighting designers and installers serving Dallas–Fort Worth homeowners.',
    metaDescription: 'Compare residential lighting companies serving Dallas–Fort Worth. Browse services, service areas, company details, and request a free quote.',
  },
  {
    slug: 'commercial',
    title: 'Commercial Lighting',
    heading: 'Commercial Lighting Contractors in Dallas–Fort Worth',
    description: 'Compare commercial lighting contractors serving offices, retail, restaurants, and warehouses across the DFW area.',
    metaDescription: 'Find commercial lighting contractors in Dallas–Fort Worth. Energy-efficient solutions for offices, retail, and industrial spaces.',
  },
  {
    slug: 'outdoor',
    title: 'Outdoor & Landscape Lighting',
    heading: 'Outdoor & Landscape Lighting in Dallas–Fort Worth',
    description: 'Enhance your curb appeal and security with professional outdoor and landscape lighting installation across Dallas–Fort Worth.',
    metaDescription: 'Compare outdoor and landscape lighting companies serving Dallas–Fort Worth. Browse low-voltage, security, and architectural lighting services.',
  },
  {
    slug: 'electricians',
    title: 'Lighting Electricians',
    heading: 'Lighting Electricians in Dallas–Fort Worth',
    description: 'Find electricians offering lighting installation, upgrades, and repairs for residential and commercial properties.',
    metaDescription: 'Compare lighting electricians serving Dallas–Fort Worth for fixture installation, LED retrofits, panel upgrades, and electrical repairs.',
  },
  {
    slug: 'smart-home',
    title: 'Smart Home Lighting',
    heading: 'Smart Home Lighting Installers in Dallas–Fort Worth',
    description: 'Smart lighting automation installers integrating Lutron, Philips Hue, and Control4 systems in Dallas–Fort Worth homes.',
    metaDescription: 'Smart home lighting installers in Dallas–Fort Worth. Lutron, Savant, Control4, and Philips Hue integration for DFW homes.',
  },
  {
    slug: 'holiday',
    title: 'Christmas & Holiday Lighting',
    heading: 'Christmas Light Installation in Dallas–Fort Worth',
    description: 'Professional holiday and event lighting installation and takedown services for homes and businesses across Dallas–Fort Worth.',
    metaDescription: 'Compare Christmas light installers across Dallas–Fort Worth. Explore seasonal displays, permanent lighting, services, and local companies. Request free quotes.',
  },
]

export function getCategoryMeta(slug: string): CategoryMeta | undefined {
  return CATEGORIES.find((c) => c.slug === slug)
}
