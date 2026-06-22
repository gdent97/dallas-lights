'use client'

import { useState } from 'react'
import { WEB3FORMS_KEY, WEB3FORMS_ENDPOINT } from '@/lib/forms'

export default function NewsletterSignup() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    const formData = new FormData(e.currentTarget)
    formData.append('access_key', WEB3FORMS_KEY)
    formData.append('subject', 'New newsletter signup — DallasLights.com')
    formData.append('from_name', 'DallasLights.com')

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      })
      const data = await res.json()
      setStatus(data.success ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="bg-gray-900 text-white">
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-2">Get the DFW lighting newsletter</h2>
        <p className="text-gray-300 text-sm mb-6 max-w-lg mx-auto">
          New companies, seasonal tips, and the best holiday light displays around Dallas–Fort Worth — straight to your inbox.
        </p>

        {status === 'done' ? (
          <p className="text-brand-300 font-semibold">✅ You&apos;re subscribed — thanks!</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              name="email"
              type="email"
              required
              placeholder="you@email.com"
              className="flex-1 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap"
            >
              {status === 'submitting' ? 'Subscribing…' : 'Subscribe'}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="text-red-300 text-sm mt-3">Something went wrong — please try again.</p>
        )}
      </div>
    </section>
  )
}
