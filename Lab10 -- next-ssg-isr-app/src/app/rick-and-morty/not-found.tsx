import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center">
      <h2 className="text-3xl font-bold text-blue-700 mb-4">Not Found</h2>
      <p className="text-black mb-6">Could not find requested resource</p>
      <Link
        href="/rick-and-morty"
        className="bg-blue-600 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
      >
        Return Home
      </Link>
    </div>
  )
}
