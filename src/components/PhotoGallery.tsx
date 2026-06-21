import Image from 'next/image'

interface Props {
  photos: string[]
  name: string
}

/**
 * Photo gallery for a company profile. Uses next/image so photos are
 * automatically resized and compressed for fast loading on mobile.
 * Renders nothing if the listing has no photos.
 */
export default function PhotoGallery({ photos, name }: Props) {
  if (!photos || photos.length === 0) return null

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h2 className="font-bold text-gray-900 mb-4">Photos</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {photos.map((src, i) => (
          <a
            key={src}
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 group block"
          >
            <Image
              src={src}
              alt={`${name} project photo ${i + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </a>
        ))}
      </div>
    </div>
  )
}
