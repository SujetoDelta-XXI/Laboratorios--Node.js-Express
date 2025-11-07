import Link from "next/link";
import { PokemonListResponse, SimplePokemon } from "@/types/pokemon";
import { IoAdd, IoGameController, IoList } from "react-icons/io5";
import { IoMdList } from "react-icons/io";
import Image from "next/image";

async function getPokemons(): Promise<SimplePokemon[]> {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151", {
    next: { revalidate: 86400 }, // Revalida cada 24 horas
  });

  if (!res.ok) throw new Error("Error al cargar pokémon");

  const data: PokemonListResponse = await res.json();

  return data.results.map((pokemon, index) => ({
    name: pokemon.name,
    id: index + 1,
  }));
}

export default async function PokemonList() {
  const pokemons = await getPokemons();

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-left mb-12 drop-shadow-lg">
          <IoMdList size={40} className="inline-block" /> Lista de Pokémons (ISR)
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {pokemons.map((pokemon) => (
            <Link
              key={pokemon.name}
              href={`/pokemon/${pokemon.name}`}
              className="transform transition hover:scale-105"
            >
              <div className="bg-white text-gray-700 rounded-xl shadow-lg p-6 hover:shadow-2xl cursor-pointer">
                <Image
                  width={100}
                  height={100}
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${ pokemon.id }.svg`}
                  alt={pokemon.name}
                  className="w-32 h-32 mx-auto"
                  priority={false} //configuración para cargar imágenes bajo demanda
                />
                <h2 className="text-xl font-bold text-center capitalize mt-4">
                  {pokemon.name}
                </h2>
                <p className="text-gray-500 text-center">
                  #{pokemon.id.toString().padStart(3, "0")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
