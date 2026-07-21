'use client'

import { useState } from 'react'
import { WEB3FORMS_KEY, WEB3FORMS_ENDPOINT, trackConversion } from '@/lib/forms'

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')

    const formData = new FormData(e.currentTarget)
    formData.append('access_key', WEB3FORMS_KEY)
    formData.append('subject', 'Contact form message — DallasLights.com')
    formData.append('from_name', 'DallasLights.com')

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      })
      const data = await res.json()
      if (!data.success) throw new Error()
      setStatus('sent')
      trackConversion('generate_lead', { lead_type: 'contact_form' })
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="text-2xl mb-2">✓</div>
        <p className="font-semibold text-green-800">Message sent!</p>
        <p className="text-sm text-green-600 mt-1">Thanks for reaching out — we&apos;ll get back to you shortly.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-white border border-gray-200 rounded-xl p-6">
      <input
        name="name"
        required
        placeholder="Your name"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
      />
      <input
        name="email"
        type="email"
        required
        placeholder="Email address"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
      />
      <textarea
        name="message"
        rows={5}
        required
        placeholder="How can we help?"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
      />
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
      >
        {status === 'sending' ? 'Sending…' : 'Send Message'}
      </button>
      {status === 'error' && (
        <p className="text-xs text-red-600 text-center">Something went wrong. Please try again.</p>
      )}
    </form>
  )
}
