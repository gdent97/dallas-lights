import Link from 'next/link'
import { CATEGORIES } from '@/lib/categories'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">💡</span>
              <span className="font-bold text-white text-lg">
                Dallas<span className="text-brand-400">Lights</span>.com
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              The most complete directory of lighting companies, designers, and electricians
              serving Dallas–Fort Worth.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Browse by Category</h3>
            <ul className="space-y-2 text-sm">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/${cat.slug}`} className="hover:text-white transition-colors">
                    {cat.title} in Dallas
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">For Businesses</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/submit" className="hover:text-white transition-colors">Add a Free Listing</Link></li>
              <li><Link href="/submit?tier=premium" className="hover:text-white transition-colors">Premium Listing — $99/mo</Link></li>
              <li><Link href="/submit?tier=featured" className="hover:text-white transition-colors">Featured Placement — $199/mo</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-xs text-gray-500 text-center">
          © {new Date().getFullYear()} DallasLights.com · Dallas, TX · All rights reserved
        </div>
      </div>
    </footer>
  )
}
