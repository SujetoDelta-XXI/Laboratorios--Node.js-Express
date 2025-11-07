import Image from "next/image";
import { notFound } from "next/navigation";
import type { RMCharacter, RMListResponse } from "@/types/rick";

export async function generateStaticParams() {
  const res = await fetch("https://rickandmortyapi.com/api/character", {
    cache: "force-cache",
  });

  if (!res.ok) return [];

  const data: RMListResponse = await res.json();
  const limited = data.results.slice(0, 20);

  return limited.map((char) => ({ id: String(char.id) }));
}

async function getCharacter(id: string): Promise<RMCharacter> {
  const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`, {
    next: { revalidate: 864000 }, // ISR cada 10 días
  });

  if (!res.ok) {
    console.error(`❌ No se encontró el personaje con id ${id}`);
    notFound();
  }

  return res.json();
}

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ id: string }>; // 👈 ahora es Promise
}) {
  const { id } = await params; // 👈 se “desempaqueta” el Promise
  const c = await getCharacter(id);

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-linear-to-r from-blue-600 to-green-500 p-8 text-center">
          <h1 className="text-4xl font-bold text-black">{c.name}</h1>
          <p className="text-black/80 mt-1">
            {c.status} • {c.species}
          </p>
        </div>

        <div className="p-8 grid md:grid-cols-2 gap-8 items-start">
          <Image
            src={c.image}
            alt={c.name}
            width={500}
            height={500}
            className="rounded-xl w-full h-auto border-2 border-blue-200"
            loading="eager"   // 👈 mejora LCP
            priority
          />
          <div className="text-black space-y-2">
            <p><b>Gender:</b> {c.gender}</p>
            {c.type && <p><b>Type:</b> {c.type}</p>}
            <p><b>Origin:</b> {c.origin?.name}</p>
            <p><b>Location:</b> {c.location?.name}</p>
            <p><b>Episodes:</b> {c.episode.length}</p>
            <p className="text-sm opacity-70">
              <b>Created:</b>{" "}
              {new Date(c.created).toLocaleString("es-PE", {
                dateStyle: "long",
                timeStyle: "short",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
