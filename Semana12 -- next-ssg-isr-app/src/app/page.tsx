import Link from "next/link";
import { IoGameController } from "react-icons/io5";
import { GiPokecog } from "react-icons/gi";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      <main className="max-w-4xl mx-auto px-8 py-16 text-center">
        <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
          Bienvenido
        </h1>
        <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
          Elige tu aventura: explora el mundo Pokémon o sumérgete en el universo de Rick y Morty
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Pokemon Card */}
          <Link
            href="/pokemon"
            className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/20"
          >
            <div className="text-yellow-400 mb-6">
              <GiPokecog size={80} className="mx-auto group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Pokédex</h2>
            <p className="text-white/70 text-lg">
              Descubre y explora todos los Pokémon con información detallada
            </p>
          </Link>

          {/* Rick and Morty Card */}
          <Link
            href="/rick-and-morty"
            className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/20"
          >
            <div className="text-green-400 mb-6">
              <IoGameController size={80} className="mx-auto group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Rick & Morty</h2>
            <p className="text-white/70 text-lg">
              Conoce a todos los personajes del multiverso de Rick y Morty
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
