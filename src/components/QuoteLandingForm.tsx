'use client'

import { useState } from 'react'
import { WEB3FORMS_KEY, WEB3FORMS_ENDPOINT, trackConversion } from '@/lib/forms'

interface Props {
  /** e.g. "Fort Worth Landscape Lighting" — used in the email subject + tracking label */
  leadType: string
}

export default function QuoteLandingForm({ leadType }: Props) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')

    const formData = new FormData(e.currentTarget)
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
        trackConversion('generate_lead', { lead_type: leadType })
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
      <input name="name" required placeholder="Your name" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
      <input name="phone" type="tel" required placeholder="Phone number" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
      <input name="email" type="email" placeholder="Email (optional)" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
      <input name="city" placeholder="Your city / area" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
      <textarea name="project" rows={3} placeholder="Describe your project (e.g. front yard landscape lighting)" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
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
