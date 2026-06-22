/**
 * Public Web3Forms access key. Safe to expose in client code — it can only
 * route form submissions to the owner's email (grayson@pilotfinancial.co)
 * and does nothing else. Get/replace one at https://web3forms.com.
 */
export const WEB3FORMS_KEY = '67d3afbd-28cd-435b-91bb-fcd7d8808ed9'

export const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'

/**
 * Fire a Google Analytics 4 event so form submissions are measurable as
 * conversions (and can be imported into Google Ads). No-op if GA isn't loaded.
 */
export function trackConversion(eventName: string, params: Record<string, unknown> = {}): void {
  if (typeof window !== 'undefined') {
    const w = window as unknown as { gtag?: (...args: unknown[]) => void }
    if (typeof w.gtag === 'function') {
      w.gtag('event', eventName, params)
    }
  }
}
