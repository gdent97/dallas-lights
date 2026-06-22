export interface GuideMeta {
  slug: string
  title: string
  description: string
  excerpt: string
}

export const GUIDES: GuideMeta[] = [
  {
    slug: 'best-christmas-lights-dfw',
    title: 'Best Places to See Christmas Lights in Dallas–Fort Worth',
    description:
      'A local guide to the best neighborhoods and displays to see Christmas lights across Dallas–Fort Worth — from Highland Park and Swiss Avenue to Interlochen in Arlington and Christmas in the Square in Frisco.',
    excerpt:
      'The best neighborhoods and free displays to see holiday lights across DFW — Dallas, Fort Worth, Plano, Arlington and more.',
  },
]

export function getGuideBySlug(slug: string): GuideMeta | undefined {
  return GUIDES.find((g) => g.slug === slug)
}
