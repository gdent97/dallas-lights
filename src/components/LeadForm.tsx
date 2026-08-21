'use client'

import { useState } from 'react'
import { WEB3FORMS_KEY, WEB3FORMS_ENDPOINT } from '@/lib/forms'
import { trackEvent } from '@/lib/analytics'

interface Props {
  companyName: string
  companyId: string
  listingTier?: string
  city?: string
  serviceCategory?: string
}

export default function LeadForm({ companyName, companyId, listingTier, city, serviceCategory }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')

    const formData = new FormData(e.currentTarget)
    formData.append('access_key', WEB3FORMS_KEY)
    formData.append('subject', `New quote request for ${companyName} — DallasLights.com`)
    formData.append('from_name', 'DallasLights.com')
    formData.append('company', companyName)
    formData.append('companyId', companyId)

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      })
      const data = await res.json()
      if (!data.success) throw new Error()
      setStatus('sent')
      // Fired only after Web3Forms confirms success; no visitor data in params.
      trackEvent(
        'generate_lead',
        {
          lead_type: 'company_quote',
          company_id: companyId,
          company_name: companyName,
          listing_tier: listingTier,
          city,
          service_category: serviceCategory,
        },
        `company_quote:${companyId}`
      )
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="text-2xl mb-2">✓</div>
        <p className="font-semibold text-green-800">Request sent!</p>
        <p className="text-sm text-green-600 mt-1">Thanks — we&apos;ve received your request and someone will be in touch shortly.</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="font-bold text-gray-900 mb-1">Request a Free Quote</h3>
      <p className="text-sm text-gray-500 mb-4">from {companyName}</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="hidden" name="companyId" value={companyId} />

        <label htmlFor={`lead-name-${companyId}`} className="sr-only">Your name</label>
        <input
          id={`lead-name-${companyId}`}
          name="name"
          autoComplete="name"
          required
          placeholder="Your name"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
        />
        <label htmlFor={`lead-phone-${companyId}`} className="sr-only">Phone number</label>
        <input
          id={`lead-phone-${companyId}`}
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          placeholder="Phone number"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
        />
        <label htmlFor={`lead-email-${companyId}`} className="sr-only">Email address</label>
        <input
          id={`lead-email-${companyId}`}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Email (optional)"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
        />
        <label htmlFor={`lead-message-${companyId}`} className="sr-only">Project description</label>
        <textarea
          id={`lead-message-${companyId}`}
          name="message"
          rows={3}
          placeholder="Describe your project..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
        />

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
        >
          {status === 'sending' ? 'Sending…' : 'Send Request'}
        </button>

        {status === 'error' && (
          <p className="text-xs text-red-600 text-center">Something went wrong. Please try again.</p>
        )}
      </form>
    </div>
  )
}
