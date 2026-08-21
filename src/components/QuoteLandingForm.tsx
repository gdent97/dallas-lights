'use client'

import { useState } from 'react'
import { WEB3FORMS_KEY, WEB3FORMS_ENDPOINT } from '@/lib/forms'
import { trackEvent } from '@/lib/analytics'
import { CATEGORIES } from '@/lib/categories'

interface Props {
  /** e.g. "Fort Worth Landscape Lighting" — used in the email subject + tracking label */
  leadType: string
  initialServiceCategory?: string
  initialCity?: string
}

export default function QuoteLandingForm({ leadType, initialServiceCategory, initialCity }: Props) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'submitting') return
    setStatus('submitting')

    const formData = new FormData(e.currentTarget)
    const selectedCategory = String(formData.get('service_category') || '')
    const safeCategory = CATEGORIES.some((category) => category.slug === selectedCategory)
      ? selectedCategory
      : undefined
    formData.append('access_key', WEB3FORMS_KEY)
    formData.append('subject', `New lead: ${leadType} — DallasLights.com`)
    formData.append('from_name', 'DallasLights.com')
    formData.append('lead_type', leadType)

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      })
      const data = await res.json()
      if (data.success) {
        setStatus('done')
        // Fired only after Web3Forms confirms success; no visitor data in params.
        trackEvent(
          'generate_lead',
          { lead_type: leadType, service_category: safeCategory },
          `landing:${leadType}`,
        )
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="text-3xl mb-2">✅</div>
        <p className="font-bold text-green-800">Request received!</p>
        <p className="text-sm text-green-700 mt-1">
          We&apos;ll match you with a local lighting pro and they&apos;ll reach out shortly.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-3 shadow-sm">
      <h2 className="font-bold text-gray-900 text-lg">Get Free Quotes</h2>
      <p className="text-sm text-gray-500 -mt-1">Tell us about your project — no cost, no obligation.</p>
      <div>
        <label htmlFor="quote-name" className="block text-xs font-medium text-gray-600 mb-1">Your name</label>
        <input id="quote-name" name="name" autoComplete="name" required className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
      </div>
      <div>
        <label htmlFor="quote-phone" className="block text-xs font-medium text-gray-600 mb-1">Phone number</label>
        <input id="quote-phone" name="phone" type="tel" autoComplete="tel" required className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
      </div>
      <div>
        <label htmlFor="quote-email" className="block text-xs font-medium text-gray-600 mb-1">Email <span className="font-normal text-gray-400">(optional)</span></label>
        <input id="quote-email" name="email" type="email" autoComplete="email" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="quote-service" className="block text-xs font-medium text-gray-600 mb-1">Project type</label>
          <select id="quote-service" name="service_category" defaultValue={initialServiceCategory || ''} required className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white">
            <option value="">Select a service…</option>
            {CATEGORIES.map((category) => (
              <option key={category.slug} value={category.slug}>{category.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="quote-city" className="block text-xs font-medium text-gray-600 mb-1">City / area</label>
          <input id="quote-city" name="city" autoComplete="address-level2" defaultValue={initialCity} required className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
        </div>
      </div>
      <div>
        <label htmlFor="quote-project" className="block text-xs font-medium text-gray-600 mb-1">Project details</label>
        <textarea id="quote-project" name="project" rows={3} placeholder="What would you like installed or improved?" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
      </div>
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-bold py-3 rounded-lg transition-colors"
      >
        {status === 'submitting' ? 'Sending…' : 'Get My Free Quotes →'}
      </button>
      {status === 'error' && <p className="text-xs text-red-600 text-center">Something went wrong — please try again.</p>}
      <p className="text-[11px] text-gray-400 text-center">By submitting you agree to be contacted about your project.</p>
    </form>
  )
}
