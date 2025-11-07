import type { ReactNode } from "react";
import Link from "next/link";
import { IoGameController, IoHome } from "react-icons/io5";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-500 via-green-400 to-white">
      <nav className="bg-white/20 backdrop-blur sticky top-0 z-50 border-b border-white/30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/rick-and-morty"
            className="text-black text-2xl font-bold hover:text-blue-700 transition"
          >
            <IoGameController className="inline-block mr-2" size={28} />
            Rick & Morty — Next.js
          </Link>
          <Link
            href="/"
            className="text-black hover:text-blue-700 transition flex items-center gap-2"
          >
            <IoHome size={20} />
            Inicio
          </Link>
        </div>
      </nav>
      {children}
    </div>
  );
}
