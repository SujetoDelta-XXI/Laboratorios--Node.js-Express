import { ReactNode } from "react";
import { Metadata } from "next";
import { IoGameController, IoHome } from "react-icons/io5";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pokédex - Next.js",
  description: "Explora el mundo Pokémon",
};

interface PokemonLayoutProps {
  children: ReactNode;
}

export default function PokemonLayout({ children }: PokemonLayoutProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900">
      <nav className="bg-black bg-opacity-30 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/pokemon"
            className="text-white text-2xl font-bold hover:text-yellow-300 transition"
          >
            <IoGameController size={30} className="inline-block" /> Pokédex Next.js
          </Link>
          <Link
            href="/"
            className="text-white hover:text-yellow-300 transition flex items-center gap-2"
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
