import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
      <h2 className="text-3xl font-bold text-purple-700 mb-4">Not Found</h2>
      <p className="text-gray-600 mb-6">Could not find requested resource</p>
      <Link
        href="/pokemon"
        className="bg-purple-600 hover:bg-purple-800 text-white font-semibold px-6 py-2 rounded-lg transition"
      >
        Return Home
      </Link>
    </div>
  )
}
