import Image from "next/image";
import Link from "next/link";
import { RMListResponse } from "@/types/rick";
import SearchClient from "./SearchClient";

async function getCharacters() {
  const res = await fetch("https://rickandmortyapi.com/api/character", {
    cache: "force-cache", // 🔹 Forzar SSG (contenido estático)
  });

  if (!res.ok) throw new Error("No se pudo cargar la lista de personajes");

  const data: RMListResponse = await res.json();
  return data.results;
}

export default async function RMListPage() {
  const characters = await getCharacters();

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-8">
          Lista de Personajes (SSG)
        </h1>

        {/* 🔍 Búsqueda en tiempo real (CSR con useState/useEffect) */}
        <SearchClient />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {characters.map((c) => (
            <Link
              key={c.id}
              href={`/rick-and-morty/${c.id}`}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition overflow-hidden border-2 border-blue-200 hover:border-green-400"
            >
              <Image
                src={c.image}
                alt={c.name}
                width={300}
                height={300}
                className="w-full h-64 object-cover"
              />
              <div className="p-4 text-black">
                <h2 className="text-xl font-semibold text-black">{c.name}</h2>
                <p className="text-sm text-black/70">
                  {c.status} • {c.species}
                </p>
                {c.type && (
                  <p className="text-sm text-black/70">Type: {c.type}</p>
                )}
                <p className="text-sm text-black/70">Gender: {c.gender}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
