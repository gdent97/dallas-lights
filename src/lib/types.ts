export type ListingTier = 'free' | 'premium' | 'featured'

export type Category =
  | 'residential'
  | 'commercial'
  | 'outdoor'
  | 'electricians'
  | 'smart-home'
  | 'holiday'

export interface Listing {
  id: string
  slug: string
  name: string
  tier: ListingTier
  category: Category[]
  // Contact — phone/website only populated when verified from the company's own site
  phone?: string
  email?: string
  website?: string
  // Location — street/zip optional; city/state always present
  address?: string
  city: string
  state: string
  zip?: string
  description: string
  longDescription?: string
  services: string[]
  areasServed: string[]
  // Optional trust signals — only ever set from a verified source, never fabricated
  yearsInBusiness?: number
  licenseNumber?: string
  insured?: boolean
  logo?: string
  /** Background tone behind the logo. Use 'dark' for white/light logos. Default 'light'. */
  logoBg?: 'light' | 'dark'
  photos?: string[]
  rating?: number
  reviewCount?: number
  featured: boolean
}

export interface CategoryMeta {
  slug: Category
  title: string
  heading: string
  description: string
  metaDescription: string
}
