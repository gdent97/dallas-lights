'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface Props {
  photos: string[]
  name: string
}

/**
 * Photo gallery for a company profile. Uses next/image so photos are
 * automatically resized and compressed for fast loading on mobile.
 *
 * Clicking a photo opens it in an in-page lightbox (zoomed overlay with a
 * close button) — it does NOT navigate to a new page or tab.
 * Renders nothing if the listing has no photos.
 */
export default function PhotoGallery({ photos, name }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const isOpen = openIndex !== null

  const close = useCallback(() => setOpenIndex(null), [])
  const show = useCallback(
    (i: number) => setOpenIndex((i + photos.length) % photos.length),
    [photos.length],
  )

  // Keyboard controls + lock background scroll while the lightbox is open.
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') setOpenIndex((p) => (p === null ? p : (p + 1) % photos.length))
      else if (e.key === 'ArrowLeft') setOpenIndex((p) => (p === null ? p : (p - 1 + photos.length) % photos.length))
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen, close, photos.length])

  if (!photos || photos.length === 0) return null

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h2 className="font-bold text-gray-900 mb-4">Photos</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {photos.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => show(i)}
            aria-label={`View ${name} photo ${i + 1} larger`}
            className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 group block cursor-zoom-in"
          >
            <Image
              src={src}
              alt={`${name} project photo ${i + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </button>
        ))}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 sm:p-8"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={`${name} photo viewer`}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl leading-none transition-colors"
          >
            ✕
          </button>

          {/* Prev / Next (only when there is more than one photo) */}
          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); show(openIndex! - 1) }}
                aria-label="Previous photo"
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl leading-none transition-colors"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); show(openIndex! + 1) }}
                aria-label="Next photo"
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl leading-none transition-colors"
              >
                ›
              </button>
            </>
          )}

          {/* Image (clicking the image itself does not close) */}
          <div
            className="relative w-full h-full max-w-5xl max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[openIndex!]}
              alt={`${name} project photo ${openIndex! + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          {photos.length > 1 && (
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
              {openIndex! + 1} / {photos.length}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
