'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CATEGORIES } from '@/lib/categories'

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Top row: logo + CTA/hamburger */}
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
            <Image src="/brand/logo.png" alt="Dallas Lights logo" width={36} height={36} className="rounded-lg shrink-0" priority />
            <span className="font-bold text-xl text-gray-900 whitespace-nowrap">
              Dallas<span className="text-brand-500">Lights</span>.com
            </span>
          </Link>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/submit"
              className="hidden sm:inline-block bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              Add Your Business
            </Link>

            {/* Mobile hamburger */}
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden p-2 -mr-2 text-gray-700"
            >
              {open ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="6" y1="6" x2="18" y2="18" /><line x1="6" y1="18" x2="18" y2="6" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Second row: category nav, full width of its own — gives every link room to breathe */}
        <nav className="hidden lg:flex items-center justify-center gap-8 text-sm font-medium text-gray-600 border-t border-gray-100 py-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="whitespace-nowrap hover:text-brand-600 transition-colors"
            >
              {cat.title}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <nav className="lg:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-1">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              onClick={() => setOpen(false)}
              className="block py-2 text-gray-700 font-medium hover:text-brand-600"
            >
              {cat.title}
            </Link>
          ))}
          <Link
            href="/submit"
            onClick={() => setOpen(false)}
            className="block mt-2 bg-brand-500 hover:bg-brand-600 text-white text-center font-semibold px-4 py-2.5 rounded-lg"
          >
            Add Your Business
          </Link>
        </nav>
      )}
    </header>
  )
}
