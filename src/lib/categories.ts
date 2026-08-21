import type { CategoryMeta } from './types'

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: 'residential',
    title: 'Residential Lighting',
    heading: 'Residential Lighting Companies in Dallas, TX',
    description: 'Compare residential lighting designers and installers serving Dallas homeowners.',
    metaDescription: 'Compare residential lighting companies serving Dallas, TX. Browse services, service areas, company details, and request a free quote.',
  },
  {
    slug: 'commercial',
    title: 'Commercial Lighting',
    heading: 'Commercial Lighting Contractors in Dallas, TX',
    description: 'Compare commercial lighting contractors serving offices, retail, restaurants, and warehouses across the DFW area.',
    metaDescription: 'Find commercial lighting contractors in Dallas, TX. Energy-efficient solutions for offices, retail, and industrial spaces.',
  },
  {
    slug: 'outdoor',
    title: 'Outdoor & Landscape Lighting',
    heading: 'Outdoor & Landscape Lighting in Dallas, TX',
    description: 'Enhance your curb appeal and security with professional outdoor and landscape lighting installation in Dallas.',
    metaDescription: 'Compare outdoor and landscape lighting companies serving Dallas, TX. Browse low-voltage, security, and architectural lighting services.',
  },
  {
    slug: 'electricians',
    title: 'Lighting Electricians',
    heading: 'Lighting Electricians in Dallas, TX',
    description: 'Find electricians offering lighting installation, upgrades, and repairs for residential and commercial properties.',
    metaDescription: 'Compare lighting electricians serving Dallas, TX for fixture installation, LED retrofits, panel upgrades, and electrical repairs.',
  },
  {
    slug: 'smart-home',
    title: 'Smart Home Lighting',
    heading: 'Smart Home Lighting Installers in Dallas, TX',
    description: 'Smart lighting automation installers integrating Lutron, Philips Hue, and Control4 systems in Dallas homes.',
    metaDescription: 'Smart home lighting installers in Dallas, TX. Lutron, Savant, Control4, and Philips Hue integration for DFW homes.',
  },
  {
    slug: 'holiday',
    title: 'Holiday & Event Lighting',
    heading: 'Holiday & Event Lighting in Dallas, TX',
    description: 'Professional holiday and event lighting installation and takedown services for homes and businesses in Dallas.',
    metaDescription: 'Professional holiday lighting installation in Dallas, TX. Christmas lights, event lighting, and seasonal displays for homes and businesses.',
  },
]

export function getCategoryMeta(slug: string): CategoryMeta | undefined {
  return CATEGORIES.find((c) => c.slug === slug)
}
