'use client'

import { useState } from 'react'
import { WEB3FORMS_KEY, WEB3FORMS_ENDPOINT } from '@/lib/forms'
import { trackEvent } from '@/lib/analytics'

type Status = 'idle' | 'submitting' | 'success' | 'error'
type ListingTier = 'free' | 'premium' | 'featured'

interface Props {
  initialBusinessName?: string
  initialCompanyId?: string
  initialTier?: ListingTier
}

export default function ListingSubmitForm({ initialBusinessName, initialCompanyId, initialTier = 'free' }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const isClaim = Boolean(initialCompanyId)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'submitting') return
    setStatus('submitting')
    setError('')

    const formData = new FormData(e.currentTarget)
    const requestedTier = String(formData.get('requested_tier') || initialTier)
    formData.append('access_key', WEB3FORMS_KEY)
    formData.append(
      'subject',
      isClaim
        ? `Listing claim / upgrade request: ${initialBusinessName} — DallasLights.com`
        : `New ${requestedTier} listing request — DallasLights.com`,
    )
    formData.append('from_name', 'DallasLights.com')
    formData.append('request_type', isClaim ? 'claim_existing_listing' : 'new_listing')
    if (initialCompanyId) formData.append('existing_company_id', initialCompanyId)

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      })
      const data = await res.json()
      if (data.success) {
        setStatus('success')
        if (isClaim && initialCompanyId) {
          trackEvent(
            'listing_claim',
            {
              company_id: initialCompanyId,
              company_name: initialBusinessName,
              listing_tier: requestedTier,
            },
            `claim:${initialCompanyId}:${requestedTier}`,
          )
        } else {
          trackEvent(
            'submit_listing',
            { lead_type: 'new_listing', listing_tier: requestedTier },
            `new_listing:${requestedTier}`,
          )
        }
      } else {
        setStatus('error')
        setError(data.message || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setError('Network error. Please check your connection and try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-6">
        <div className="text-4xl mb-3">✅</div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Thanks — we got it!</h2>
        <p className="text-sm text-gray-600">
          {isClaim
            ? 'We’ll verify the request and contact you about the listing and upgrade options.'
            : 'We’ll review your business details and follow up before the listing is published.'}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="listing-business-name" className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
        <input id="listing-business-name" name="business_name" defaultValue={initialBusinessName} readOnly={isClaim} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 read-only:bg-gray-50" />
      </div>
      <div>
        <label htmlFor="listing-phone" className="block text-sm font-medium text-gray-700 mb-1">Your Phone Number *</label>
        <input id="listing-phone" name="phone" type="tel" autoComplete="tel" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
      </div>
      <div>
        <label htmlFor="listing-email" className="block text-sm font-medium text-gray-700 mb-1">Your Business Email *</label>
        <input id="listing-email" name="email" type="email" autoComplete="email" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
      </div>
      <div>
        <label htmlFor="listing-website" className="block text-sm font-medium text-gray-700 mb-1">Website</label>
        <input id="listing-website" name="website" type="url" autoComplete="url" placeholder="https://" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
      </div>
      <div>
        <label htmlFor="listing-tier" className="block text-sm font-medium text-gray-700 mb-1">Interested Plan *</label>
        <select id="listing-tier" name="requested_tier" defaultValue={initialTier} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white">
          <option value="free">Free Listing — $0</option>
          <option value="premium">Premium — $99/month</option>
          <option value="featured">Featured — $199/month</option>
        </select>
      </div>
      <div>
        <label htmlFor="listing-category" className="block text-sm font-medium text-gray-700 mb-1">Primary Category *</label>
        <select id="listing-category" name="category" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white">
          <option value="">Select a category…</option>
          <option>Residential Lighting</option>
          <option>Commercial Lighting</option>
          <option>Outdoor &amp; Landscape Lighting</option>
          <option>Lighting Electricians</option>
          <option>Smart Home Lighting</option>
          <option>Holiday &amp; Event Lighting</option>
        </select>
      </div>
      <div>
        <label htmlFor="listing-description" className="block text-sm font-medium text-gray-700 mb-1">What should we know? *</label>
        <textarea id="listing-description" name="description" rows={3} required placeholder={isClaim ? 'Tell us your role at the business and any listing updates you need.' : 'Briefly describe your services and DFW service area.'} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
      >
        {status === 'submitting' ? 'Submitting…' : isClaim ? 'Request Claim & Upgrade' : 'Submit Listing Request'}
      </button>
      <p className="text-xs text-gray-500 text-center">
        No payment is collected here. We&apos;ll contact you to verify the business and discuss next steps.
      </p>
    </form>
  )
}
