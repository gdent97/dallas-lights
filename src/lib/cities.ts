import { CATEGORIES } from './categories'
import { listingsForCategoryCity, MIN_CITY_PAGE_LISTINGS } from './listings'
import type { Category } from './types'

export interface City {
  slug: string
  name: string
}

/**
 * Target DFW cities for location landing pages. Add more over time — a page
 * only gets generated for a city+category combo that has enough real companies
 * (see getCityCategoryCombos), so adding a city here never creates a thin page.
 */
export const CITIES: City[] = [
  { slug: 'dallas', name: 'Dallas' },
  { slug: 'fort-worth', name: 'Fort Worth' },
  { slug: 'plano', name: 'Plano' },
  { slug: 'frisco', name: 'Frisco' },
  { slug: 'mckinney', name: 'McKinney' },
  { slug: 'southlake', name: 'Southlake' },
  { slug: 'arlington', name: 'Arlington' },
  { slug: 'keller', name: 'Keller' },
  { slug: 'lewisville', name: 'Lewisville' },
  { slug: 'colleyville', name: 'Colleyville' },
  { slug: 'grapevine', name: 'Grapevine' },
  { slug: 'flower-mound', name: 'Flower Mound' },
  { slug: 'allen', name: 'Allen' },
  { slug: 'prosper', name: 'Prosper' },
  { slug: 'coppell', name: 'Coppell' },
  { slug: 'carrollton', name: 'Carrollton' },
  { slug: 'irving', name: 'Irving' },
  { slug: 'denton', name: 'Denton' },
]

export function getCityBySlug(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug)
}

export interface CityCategoryCombo {
  category: Category
  categoryTitle: string
  citySlug: string
  cityName: string
  count: number
}

/** Every city+category that has enough real companies to be a substantive page. */
export function getCityCategoryCombos(): CityCategoryCombo[] {
  const combos: CityCategoryCombo[] = []
  for (const cat of CATEGORIES) {
    for (const city of CITIES) {
      const count = listingsForCategoryCity(cat.slug, city.name).length
      if (count >= MIN_CITY_PAGE_LISTINGS) {
        combos.push({
          category: cat.slug,
          categoryTitle: cat.title,
          citySlug: city.slug,
          cityName: city.name,
          count,
        })
      }
    }
  }
  return combos
}

/** Cities (with a valid page) for one category — used for internal linking. */
export function citiesForCategory(category: Category): City[] {
  return CITIES.filter(
    (city) => listingsForCategoryCity(category, city.name).length >= MIN_CITY_PAGE_LISTINGS,
  )
}
