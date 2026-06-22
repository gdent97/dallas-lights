'use client'

import { useState } from 'react'
import { WEB3FORMS_KEY, WEB3FORMS_ENDPOINT } from '@/lib/forms'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function ListingSubmitForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    setError('')

    const formData = new FormData(e.currentTarget)
    formData.append('access_key', WEB3FORMS_KEY)
    formData.append('subject', 'New Free Listing submission — DallasLights.com')
    formData.append('from_name', 'DallasLights.com')

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      })
      const data = await res.json()
      if (data.success) {
        setStatus('success')
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
          Your listing has been submitted. We&apos;ll review and publish it within 24 hours.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
        <input name="business_name" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
        <input name="phone" type="tel" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
        <input name="email" type="email" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
        <input name="website" type="url" placeholder="https://" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
        <select name="category" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400">
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
        <textarea name="description" rows={3} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
      >
        {status === 'submitting' ? 'Submitting…' : 'Submit Free Listing'}
      </button>
    </form>
  )
}
