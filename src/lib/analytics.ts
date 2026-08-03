/**
 * GA4 event helpers.
 *
 * Privacy rule: only non-personal parameters may be sent — company_id,
 * company_name, city, service_category, listing_tier, lead_type, page_path.
 * Never pass visitor form values (name, email, phone, message, zip, etc.).
 */

export type EventParams = Record<string, string | number | boolean | undefined>

/** Events already sent this page lifecycle, keyed by `${name}:${dedupeKey}`. */
const sentEvents = new Set<string>()

/**
 * Fire a GA4 event via gtag. No-op on the server or if GA isn't loaded.
 *
 * @param dedupeKey When set, the same event+key fires at most once per page
 *                  lifecycle (guards double-clicks and repeat submissions).
 */
export function trackEvent(
  eventName: string,
  params: EventParams = {},
  dedupeKey?: string
): void {
  if (typeof window === 'undefined') return
  const w = window as unknown as { gtag?: (...args: unknown[]) => void }
  if (typeof w.gtag !== 'function') return

  if (dedupeKey) {
    const key = `${eventName}:${dedupeKey}`
    if (sentEvents.has(key)) return
    sentEvents.add(key)
  }

  const clean: Record<string, string | number | boolean> = {}
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) clean[k] = v
  }
  if (clean.page_path === undefined) clean.page_path = window.location.pathname

  w.gtag('event', eventName, clean)
}
