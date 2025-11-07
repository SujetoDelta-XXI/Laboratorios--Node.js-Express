'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
      <h2 className="text-3xl font-bold text-red-600 mb-4">¡Algo salió mal!</h2>
      <p className="text-gray-700 mb-6">{error.message}</p>
      <button
        onClick={() => reset()}
        className="bg-purple-600 hover:bg-purple-800 text-white font-semibold px-6 py-2 rounded-lg transition"
      >
        Intentar de nuevo
      </button>
    </div>
  )
}
