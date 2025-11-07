import Link from 'next/link';
import { Metadata } from 'next';
import { Pokemon, PokemonListResponse } from '@/types/pokemon';
import Image from 'next/image';

interface PokemonPageProps {
  params: {
    name: string;
  };
}

async function getPokemon(name: string): Promise<Pokemon> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`, {
    next: { revalidate: 86400 } // Revalida cada 24 horas
  });
  
  if (!res.ok) throw new Error('Pokémon no encontrado');
  return res.json();
}

export async function generateStaticParams() { // Genera los parámetros estáticos para SSG
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
  const data: PokemonListResponse = await res.json();
  
  return data.results.map((pokemon) => ({
    name: pokemon.name,
  }));
}

export async function generateMetadata({ params }: PokemonPageProps): Promise<Metadata> {
  // Genera la metadata dinámica para cada página de Pokémon
  const {name} = await params;
  const pokemon = await getPokemon(name);
  
  return {
    title: `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} - Pokédex`,
    description: `Información sobre ${pokemon.name}`,
  };
}

const typeColors: Record<string, string> = {
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  grass: 'bg-green-500',
  electric: 'bg-yellow-400',
  psychic: 'bg-pink-500',
  ice: 'bg-cyan-400',
  dragon: 'bg-indigo-600',
  dark: 'bg-gray-800',
  fairy: 'bg-pink-300',
  normal: 'bg-gray-400',
  fighting: 'bg-orange-700',
  flying: 'bg-indigo-400',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-600',
  rock: 'bg-yellow-800',
  bug: 'bg-green-600',
  ghost: 'bg-purple-700',
  steel: 'bg-gray-500',
};

export default async function PokemonDetail({ params }: PokemonPageProps) {

    const {name} = await params;
    const pokemon = await getPokemon(name);

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className={`bg-linear-to-r from-black ${typeColors[pokemon.types[0].type.name]} p-8`}>
          <h1 className="text-5xl font-bold text-white capitalize text-center">
            {pokemon.name}
          </h1>
          <p className="text-white text-center text-xl mt-2">
            #{pokemon.id.toString().padStart(3, '0')}
          </p>
        </div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 flex justify-center items-center">
              <Image
                width={150}
                height={150}
                src={pokemon.sprites.other['official-artwork'].front_default}
                alt={pokemon.name}
                className="w-64 h-64"
              />
            </div>

            <div className="flex-1">
              <div className="mb-6">
                <h3 className="text-2xl text-gray-700 font-bold mb-3">Tipos</h3>
                <div className="flex gap-2">
                  {pokemon.types.map((type) => (
                    <span
                      key={type.type.name}
                      className={`${typeColors[type.type.name] || 'bg-gray-400'} text-white px-4 py-2 rounded-full font-semibold capitalize`}
                    >
                      {type.type.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl text-gray-700 font-bold mb-3">Estadísticas</h3>
                {pokemon.stats.map((stat) => (
                  <div key={stat.stat.name} className="mb-3 text-gray-700">
                    <div className="flex justify-between mb-1">
                      <span className="capitalize font-semibold">
                        {stat.stat.name.replace('-', ' ')}
                      </span>
                      <span className="font-bold">{stat.base_stat}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-linear-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all"
                        style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className='text-gray-700'>
                <h3 className="text-2xl font-bold mb-3">Información</h3>
                <div className="space-y-2">
                  <p><strong>Altura:</strong> {pokemon.height / 10} m</p>
                  <p><strong>Peso:</strong> {pokemon.weight / 10} kg</p>
                  <p>
                    <strong>Habilidades:</strong>{' '}
                    {pokemon.abilities.map(a => a.ability.name).join(', ')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-gray-50">
          <Link
            href="/pokemon"
            className="inline-block bg-black hover:bg-purple-900 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            ← Volver al Pokédex
          </Link>
        </div>
      </div>
    </div>
  );
}
