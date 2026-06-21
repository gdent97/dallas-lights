import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto text-center py-24 px-4">
      <div className="text-5xl mb-4">💡</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
      <p className="text-gray-500 mb-6">That page doesn't exist. Let's get you back on track.</p>
      <Link href="/" className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors">
        Back to Home
      </Link>
    </div>
  )
}
