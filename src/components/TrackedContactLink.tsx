'use client'

import { trackEvent, type EventParams } from '@/lib/analytics'

interface Props {
  /** GA4 event name, e.g. 'click_phone' | 'click_email' | 'click_company_website' */
  event: string
  href: string
  /** Non-personal event params only (company_id, city, listing_tier, …). */
  params?: EventParams
  newTab?: boolean
  sponsored?: boolean
  className?: string
  children: React.ReactNode
}

/**
 * Anchor that fires a GA4 event on click. Company phone/email hrefs are the
 * company's own published contact info; they are never sent as event params.
 */
export default function TrackedContactLink({ event, href, params, newTab, sponsored, className, children }: Props) {
  return (
    <a
      href={href}
      target={newTab ? '_blank' : undefined}
      rel={[newTab && 'noopener noreferrer', sponsored && 'sponsored'].filter(Boolean).join(' ') || undefined}
      className={className}
      onClick={() => trackEvent(event, params, href)}
    >
      {children}
    </a>
  )
}
