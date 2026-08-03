'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

/**
 * Fires a GA4 page_view on App Router client-side navigations.
 * The initial page load is already counted by gtag('config', …), so the
 * first render is skipped to avoid a duplicate.
 */
export default function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isInitialLoad = useRef(true)

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false
      return
    }
    const w = window as unknown as { gtag?: (...args: unknown[]) => void }
    if (typeof w.gtag !== 'function') return
    const query = searchParams?.toString()
    w.gtag('event', 'page_view', {
      page_path: query ? `${pathname}?${query}` : pathname,
      page_location: window.location.href,
      page_title: document.title,
    })
  }, [pathname, searchParams])

  return null
}
