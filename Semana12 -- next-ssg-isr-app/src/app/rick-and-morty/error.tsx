// src/app/rick-and-morty/error.tsx
"use client";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center">
      <h2 className="text-3xl font-bold text-red-600 mb-4">¡Algo salió mal!</h2>
      <p className="text-black mb-6">{error.message}</p>
      <button type="button" onClick={() => reset()} className="bg-blue-600 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors">
        Intentar de nuevo
      </button>
    </div>
  );
}
