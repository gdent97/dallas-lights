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
  {
    slug: 'christmas-light-installation-cost-dallas',
    title: 'How Much Does Christmas Light Installation Cost in Dallas?',
    description:
      'What professional Christmas light installation typically costs in Dallas–Fort Worth — pricing by home size, what is included, when to book, and the questions to ask before hiring an installer.',
    excerpt:
      'Typical pricing for professional holiday light installation in DFW, what is included, when to book, and how to compare quotes.',
  },
  {
    slug: 'landscape-lighting-cost-dallas',
    title: 'Landscape Lighting Cost in Dallas: A Homeowner’s Guide',
    description:
      'What professional landscape lighting costs for Dallas–Fort Worth homes — typical per-fixture and whole-project pricing, what drives the price, and how to choose an outdoor lighting company.',
    excerpt:
      'Per-fixture and whole-project pricing for professional landscape lighting in DFW, what drives cost, and how to pick an installer.',
  },
]

export function getGuideBySlug(slug: string): GuideMeta | undefined {
  return GUIDES.find((g) => g.slug === slug)
}
