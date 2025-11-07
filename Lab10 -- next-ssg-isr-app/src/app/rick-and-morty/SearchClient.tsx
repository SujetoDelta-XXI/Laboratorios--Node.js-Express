'use client'

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { RMListResponse, RMCharacter } from "@/types/rick";

const statuses = ["", "Alive", "Dead", "unknown"];
const genders = ["", "Female", "Male", "Genderless", "unknown"];

export default function SearchClient() {
  const [name, setName] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [results, setResults] = useState<RMCharacter[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Construcción de la query
  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (name) params.set("name", name);
    if (status) params.set("status", status);
    if (type) params.set("type", type);
    if (gender) params.set("gender", gender);
    return params.toString();
  }, [name, status, type, gender]);

  useEffect(() => {
    let ignore = false;
    const run = async () => {
      if (!name && !status && !type && !gender) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`https://rickandmortyapi.com/api/character?${query}`);
        if (!res.ok) throw new Error("Error en la búsqueda");
        const data: RMListResponse = await res.json();
        if (!ignore) setResults(data.results ?? []);
      } catch {
        if (!ignore) setResults([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    const timer = setTimeout(run, 350); // debounce
    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [query]);

  const handleSelect =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLSelectElement>) =>
      setter(e.target.value);

  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl p-4 border-2 border-blue-200">
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        <input
          placeholder="Name…"
          className="rounded px-3 py-2 border-2 border-blue-200 focus:border-green-400 focus:outline-none text-black"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
        />

        <select
          className="rounded px-3 py-2 border-2 border-blue-200 focus:border-green-400 focus:outline-none text-black"
          value={status}
          onChange={handleSelect(setStatus)}
          aria-label="Filtrar por estado"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s || "Any status"}
            </option>
          ))}
        </select>

        <input
          placeholder="Type…"
          className="rounded px-3 py-2 border-2 border-blue-200 focus:border-green-400 focus:outline-none text-black"
          value={type}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setType(e.target.value)}
        />

        <select
          className="rounded px-3 py-2 border-2 border-blue-200 focus:border-green-400 focus:outline-none text-black"
          value={gender}
          onChange={handleSelect(setGender)}
          aria-label="Filtrar por género"
        >
          {genders.map((g) => (
            <option key={g} value={g}>
              {g || "Any gender"}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-black/80 mt-3">Buscando…</p>}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {results.map((c) => (
            <Link
              key={c.id}
              href={`/rick-and-morty/${c.id}`}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition border-2 border-blue-200 hover:border-green-400"
            >
              <Image
                src={c.image}
                alt={c.name}
                width={300}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-3 text-black">
                <p className="font-semibold text-black">{c.name}</p>
                <p className="text-sm text-black/70">
                  {c.status} • {c.species}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
