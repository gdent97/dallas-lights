import type { CategoryMeta } from './types'

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: 'residential',
    title: 'Residential Lighting',
    heading: 'Residential Lighting Companies in Dallas, TX',
    description: 'Find top-rated residential lighting designers and installers serving Dallas homeowners.',
    metaDescription: 'Compare the best residential lighting companies in Dallas, TX. Read reviews, get quotes, and find licensed installers near you.',
  },
  {
    slug: 'commercial',
    title: 'Commercial Lighting',
    heading: 'Commercial Lighting Contractors in Dallas, TX',
    description: 'Licensed commercial lighting contractors for offices, retail, restaurants, and warehouses across the DFW area.',
    metaDescription: 'Find commercial lighting contractors in Dallas, TX. Energy-efficient solutions for offices, retail, and industrial spaces.',
  },
  {
    slug: 'outdoor',
    title: 'Outdoor & Landscape Lighting',
    heading: 'Outdoor & Landscape Lighting in Dallas, TX',
    description: 'Enhance your curb appeal and security with professional outdoor and landscape lighting installation in Dallas.',
    metaDescription: 'Top outdoor and landscape lighting companies in Dallas, TX. Low-voltage, security, and architectural lighting for homes and businesses.',
  },
  {
    slug: 'electricians',
    title: 'Lighting Electricians',
    heading: 'Licensed Lighting Electricians in Dallas, TX',
    description: 'Certified electricians specializing in lighting installation, upgrades, and repairs for residential and commercial properties.',
    metaDescription: 'Licensed lighting electricians in Dallas, TX. Panel upgrades, fixture installation, LED retrofits, and electrical repairs.',
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
